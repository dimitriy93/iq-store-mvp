import type {IBluetooth} from "./bluetooth.types";

declare global {
    interface Navigator {
        readonly bluetooth?: IBluetooth;
    }
}