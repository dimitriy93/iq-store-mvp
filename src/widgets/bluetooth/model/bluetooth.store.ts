import {makeAutoObservable} from "mobx";
import type {
    IBluetoothDevice,
    IBluetoothRemoteGATTServer,
    IDeviceInfo,
    TPhase,
} from "./bluetooth.types";
import {describeError, isSupported} from "../lib/bluetooth.utuls.ts";

export class BluetoothStore {
    phase: TPhase = "idle";
    device: IDeviceInfo | null = null;
    battery: number | null = null;
    error: string | null = null;

    readonly supported: boolean;
    private deviceRef: IBluetoothDevice | null = null;
    private errorTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        makeAutoObservable(this);
        this.supported = isSupported();
    }

    get isBusy(): boolean {
        return this.phase === "requesting" || this.phase === "connecting";
    }

    get isConnected(): boolean {
        return this.phase === "connected";
    }

    *requestDevice() {
        if (!this.supported) {
            this.showError(
                "Web Bluetooth недоступен в этом браузере."
            );
            return;
        }

        const bluetooth = navigator.bluetooth;

        if (!bluetooth) {
            this.showError("Web Bluetooth недоступен в этом браузере.");
            return;
        }

        this.error = null;
        this.phase = "requesting";

        try {
            const device: IBluetoothDevice = yield bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [
                    "battery_service",
                    "device_information",
                ],
            });

            this.deviceRef = device;

            this.device = {
                id: device.id,
                name: device.name || "Безымянное устройство",
            };

            device.addEventListener("gattserverdisconnected", this.handleDisconnected);

            if (!device.gatt) {
                throw new Error("Устройство не предоставляет GATT-сервер для подключения.");
            }

            this.phase = "connecting";
            const server: IBluetoothRemoteGATTServer = yield device.gatt.connect();
            this.phase = "connected";

            yield this.readBattery(server);
        } catch (error) {
            this.phase = "idle";
            this.battery = null;

            this.showError(describeError(error));
        }
    }

    disconnect(): void {
        this.deviceRef?.gatt?.disconnect();

        this.phase = "idle";
        this.battery = null;
    }

    clearError(): void {
        this.error = null;
    }

    destroy(): void {
        this.deviceRef?.removeEventListener("gattserverdisconnected", this.handleDisconnected);

        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
        }
    }

    private *readBattery(server: IBluetoothRemoteGATTServer) {
        try {
            const service: Awaited<ReturnType<IBluetoothRemoteGATTServer["getPrimaryService"]>> = yield server.getPrimaryService("battery_service");
            const characteristic: Awaited<ReturnType<typeof service.getCharacteristic>> = yield service.getCharacteristic("battery_level");
            const value: DataView = yield characteristic.readValue();

            this.battery = value.getUint8(0);
        } catch (error) {
            console.error("Failed to read battery level:", error);
        }
    }

    private readonly handleDisconnected = (): void => {
        this.phase = "idle";
        this.battery = null;
    };

    private showError(message: string): void {
        this.error = message;

        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
        }

        this.errorTimer = setTimeout(() => {
            this.error = null;
        }, 7000);
    }
}

export const bluetoothStore = new BluetoothStore();