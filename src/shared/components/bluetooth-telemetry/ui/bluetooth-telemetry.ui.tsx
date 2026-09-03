import type {FC} from "react";
import type {ITelemetryItemProps} from "../model/bluetooth-telemetry.types";
import "./bluetooth-telemetry.styles.scss";

export const BluetoothTelemetry: FC<ITelemetryItemProps> = ({ icon: Icon, label, value, active = false, delay = 0 }) => (
    <div
        className={`bluetooth-telemetry inner-hairline ${active ? "bluetooth-telemetry--active" : ""}`}
        style={{animationDelay: `${delay}ms`}}
    >
        <Icon className={`bluetooth-telemetry__icon ${active ? "bluetooth-telemetry__icon--active" : ""}`} />

        <p className="bluetooth-telemetry__label">
            {label}
        </p>

        <p className={`bluetooth-telemetry__value tnum ${active ? "bluetooth-telemetry__value--active" : ""}`}>
            {value}
        </p>
    </div>
);