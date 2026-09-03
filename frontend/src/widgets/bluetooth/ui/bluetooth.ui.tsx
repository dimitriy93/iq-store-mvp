import {observer} from "mobx-react-lite";
import {
    BatteryMediumIcon,
    BluetoothConnectedIcon,
    BluetoothIcon,
    BluetoothOffIcon,
    RadioIcon,
    TriangleAlertIcon,
    UnplugIcon,
    WavesIcon,
    XIcon,
} from "@/shared/components/icons";
import {BluetoothTelemetry} from "@/shared/components/bluetooth-telemetry";
import {STATUS_LABELS, STATUS_TEXTS} from "../model/bluetooth.data.ts";
import {bluetoothStore} from "../model/bluetooth.store.ts";
import "./bluetooth.styles.scss";

export const BluetoothPage = observer(() => {
    const {
        supported,
        phase,
        device,
        battery,
        error,
        isBusy,
        isConnected,
    } = bluetoothStore;

    let actionLabel = "Подключить";

    if (!supported) {
        actionLabel = "Недоступно";
    } else if (isConnected) {
        actionLabel = "Отключить";
    } else if (phase === "requesting") {
        actionLabel = "Поиск";
    } else if (phase === "connecting") {
        actionLabel = "Соединение";
    }

    let actionIconClassName = "bluetooth__action-icon";

    if (!supported) {
        actionIconClassName += " bluetooth__action-icon--off";
    } else if (isConnected) {
        actionIconClassName += " bluetooth__action-icon--connected";
    } else if (isBusy) {
        actionIconClassName += " bluetooth__action-icon--busy";
    }

    const actionLabelClassName = isBusy || isConnected
            ? "bluetooth__action-label bluetooth__action-label--active"
            : "bluetooth__action-label";

    let radarGlowModifier = "";

    if (isBusy) {
        radarGlowModifier = "bluetooth__radar-glow--busy";
    } else if (isConnected) {
        radarGlowModifier = "bluetooth__radar-glow--connected";
    }

    const radarScanClassName = isBusy
        ? "bluetooth__radar-scan bluetooth__radar-scan--active"
        : "bluetooth__radar-scan";

    const handlePrimaryAction = () => {
        if (isBusy) {
            return;
        }

        if (isConnected) {
            bluetoothStore.disconnect();
            return;
        }

        void bluetoothStore.requestDevice();
    };

    return (
        <section className="bluetooth">
            <header className="bluetooth__header">
                <p className="bluetooth__eyebrow">
                    Консоль устройства
                </p>

                <h2 className="bluetooth__heading">
                    <span className="bluetooth__heading-accent">
                        Bluetooth
                    </span>
                    {" "}
                    подключение
                </h2>
            </header>

            <div className="bluetooth__radar">
                <div className="bluetooth__radar-stage">
                    {[1, 0.72, 0.46].map((scale) => (
                        <span
                            key={scale}
                            aria-hidden
                            className="bluetooth__radar-ring"
                            style={{
                                width: `${scale * 100}%`,
                                height: `${scale * 100}%`,
                            }}
                        />
                    ))}

                    {[0, 0.7, 1.4, 2.1].map((delay) => (
                        <span
                            key={delay}
                            aria-hidden
                            className={`bluetooth__radar-ripple ${isBusy || isConnected ? "bluetooth__radar-ripple--active" : ""}`}
                            style={{ animationDelay: `${delay}s` }}
                        />
                    ))}

                    <div aria-hidden className={`bluetooth__radar-glow ${radarGlowModifier}`}/>
                    <div aria-hidden className={`bluetooth__radar-scan ${radarScanClassName}`}/>

                    <button
                        type="button"
                        onClick={handlePrimaryAction}
                        disabled={isBusy}
                        className={`
                            bluetooth__action glass 
                            ${isBusy ? "bluetooth__action--busy" : ""} 
                            ${isConnected ? "bluetooth__action--connected" : ""}`
                        }
                    >
                        {!supported ? (
                            <BluetoothOffIcon className={actionIconClassName} />
                        ) : isConnected ? (
                            <BluetoothConnectedIcon className={actionIconClassName} />
                        ) : (
                            <BluetoothIcon className={actionIconClassName} />
                        )}

                        <span className={actionLabelClassName}>
                            {actionLabel}
                        </span>

                        {isBusy && (
                            <span className="bluetooth__action-dots" aria-hidden>
                                {[0, 1, 2].map((dot) => (
                                    <span
                                        key={dot}
                                        className="bluetooth__action-dot"
                                        style={{ animationDelay: `${dot * 0.22}s` }}
                                    />
                                ))}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <p key={`${phase}-${supported}`} className="bluetooth__status">
                {supported ? STATUS_TEXTS[phase] : STATUS_TEXTS.unsupported}
            </p>

            {error && (
                <div className="bluetooth__toast">
                    <TriangleAlertIcon className="bluetooth__toast-icon" />
                    <p className="bluetooth__toast-text">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => bluetoothStore.clearError()}
                        className="bluetooth__toast-close"
                    >
                        <XIcon className="bluetooth__toast-close-icon" />
                    </button>
                </div>
            )}

            {device && (
                <div className="bluetooth__device inner-hairline">
                    <div className="bluetooth__device-top">
                        <div className="bluetooth__device-name-wrap">
                            <p className="bluetooth__device-label">
                                Имя устройства
                            </p>

                            <h3 className="bluetooth__device-name">
                                {device.name}
                            </h3>
                        </div>

                        <span className={`bluetooth__device-badge ${ isConnected ? "bluetooth__device-badge--connected" : "" }`}>
                            <span className={`bluetooth__device-badge-dot ${ isConnected ? "bluetooth__device-badge-dot--connected" : "" }`}/>
                            {isConnected ? "Подключено" : "Отключено"}
                        </span>
                    </div>

                    <div className="bluetooth__device-id-wrap">
                        <p className="bluetooth__device-label">
                            Device ID
                        </p>

                        <p className="bluetooth__device-id tnum">
                            {device.id}
                        </p>
                    </div>

                    {!isConnected && (
                        <button
                            type="button"
                            onClick={() =>
                                void bluetoothStore.requestDevice()
                            }
                            className="bluetooth__device-reconnect"
                        >
                            <UnplugIcon className="bluetooth__device-reconnect-icon" />
                            Переподключить
                        </button>
                    )}
                </div>
            )}

            <div className="bluetooth__telemetry">
                <BluetoothTelemetry
                    icon={RadioIcon}
                    label="Статус"
                    value={!supported ? "—" : STATUS_LABELS[phase]}
                    active={isBusy || isConnected}
                    delay={0}
                />

                <BluetoothTelemetry
                    icon={WavesIcon}
                    label="Протокол"
                    value="BLE 5.3"
                    delay={70}
                />

                <BluetoothTelemetry
                    icon={BatteryMediumIcon}
                    label="Батарея"
                    value={battery === null ? "—" : `${battery}%`}
                    active={battery !== null}
                    delay={140}
                />
            </div>
        </section>
    );
});