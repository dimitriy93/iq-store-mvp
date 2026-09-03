export type TPhase = "idle" | "requesting" | "connecting" | "connected";

export interface IDeviceInfo {
    name: string;
    id: string;
}

export interface IBluetoothRemoteGATTServer {
    readonly connected: boolean;
    connect(): Promise<IBluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<IBluetoothRemoteGATTService>;
}

export interface IBluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<IBluetoothRemoteGATTCharacteristic>;
}

export interface IBluetoothRemoteGATTCharacteristic {
    readValue(): Promise<DataView>;
}

export interface IBluetoothDevice extends EventTarget {
    id: string;
    name?: string;
    gatt?: IBluetoothRemoteGATTServer;
}

export interface IBluetoothRequestDeviceOptions {
    acceptAllDevices?: boolean;
    optionalServices?: string[];
}

export interface IBluetooth {
    requestDevice(options?: IBluetoothRequestDeviceOptions): Promise<IBluetoothDevice>;
}