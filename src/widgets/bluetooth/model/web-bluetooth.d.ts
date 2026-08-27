/*
 * Minimal ambient declarations for the Web Bluetooth API.
 * TypeScript's DOM lib does not include it (it is a separate spec),
 * only the surface used by the Bluetooth widget is described here.
 */

interface BluetoothRemoteGATTServer {
    readonly connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
    readValue(): Promise<DataView>;
}

interface BluetoothDevice extends EventTarget {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRequestDeviceOptions {
    acceptAllDevices?: boolean;
    optionalServices?: string[];
}

interface Bluetooth {
    requestDevice(options?: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
}

interface Navigator {
    readonly bluetooth?: Bluetooth;
}
