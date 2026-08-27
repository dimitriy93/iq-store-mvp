import {useCallback, useEffect, useRef, useState, type ComponentType} from "react";
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
    type IIconProps,
} from "@/shared/components/icons";
import "./bluetooth.styles.scss";

type Phase = "idle" | "requesting" | "connecting" | "connected";

interface IDeviceInfo {
    name: string;
    id: string;
}

interface ITelemetryItemProps {
    icon: ComponentType<IIconProps>;
    label: string;
    value: string;
    active?: boolean;
    delay?: number;
}

/**
 * Kept at module scope so a paired device survives page switches
 * (the page unmounts when the route changes).
 */
let pairedDevice: BluetoothDevice | null = null;

const isSupported = (): boolean => typeof navigator !== "undefined" && !!navigator.bluetooth;

const describeError = (error: unknown): string => {
    if (error instanceof DOMException) {
        switch (error.name) {
            case "NotFoundError":
                return "Устройство не выбрано — запрос отклонён или поблизости ничего нет.";
            case "SecurityError":
                return "Соединение заблокировано браузером. Откройте приложение в отдельной вкладке по HTTPS и попробуйте снова.";
            case "NetworkError":
                return "Соединение оборвалось до завершения рукопожатия. Подойдите ближе и повторите.";
            case "NotSupportedError":
                return "Устройство отказало в запрошенных сервисах.";
            case "InvalidStateError":
                return "Адаптер занят. Подождите немного и попробуйте снова.";
            default:
                return error.message || "Ошибка Bluetooth-запроса.";
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Что-то пошло не так при обращении к адаптеру.";
};

const STATUS_LABELS: Record<Phase, string> = {
    idle: "Ожидание",
    requesting: "Поиск",
    connecting: "Соединение",
    connected: "На связи",
};

const STATUS_TEXTS: Record<"unsupported" | Phase, string> = {
    unsupported: "В этом браузере нет Web Bluetooth. Его поддерживают Chrome, Edge и Opera.",
    idle: "Нажмите на маячок, чтобы открыть системный выбор устройства.",
    requesting: "Ожидаем выбор устройства в системном окне…",
    connecting: "Согласуем GATT-рукопожатие…",
    connected: "Соединение установлено. Телеметрия активна.",
};

export const BluetoothPage = () => {
    const [supported] = useState(isSupported);
    const [phase, setPhase] = useState<Phase>(() => (pairedDevice?.gatt?.connected ? "connected" : "idle"));
    const [device, setDevice] = useState<IDeviceInfo | null>(() => (
        pairedDevice ? {name: pairedDevice.name || "Безымянное устройство", id: pairedDevice.id} : null
    ));
    const [battery, setBattery] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const busy = phase === "requesting" || phase === "connecting";
    const connected = phase === "connected";

    const raise = useCallback((message: string) => {
        setError(message);

        if (errorTimer.current) {
            clearTimeout(errorTimer.current);
        }

        errorTimer.current = setTimeout(() => setError(null), 7000);
    }, []);

    const handleDisconnected = useCallback(() => {
        setPhase("idle");
        setBattery(null);
    }, []);

    // Track disconnects of an already paired device while the page is mounted.
    useEffect(() => {
        const current = pairedDevice;

        if (!current) {
            return;
        }

        current.addEventListener("gattserverdisconnected", handleDisconnected);

        return () => current.removeEventListener("gattserverdisconnected", handleDisconnected);
    }, [handleDisconnected]);

    useEffect(
        () => () => {
            if (errorTimer.current) {
                clearTimeout(errorTimer.current);
            }
        },
        []
    );

    async function readBattery(server: BluetoothRemoteGATTServer) {
        try {
            const service = await server.getPrimaryService("battery_service");
            const characteristic = await service.getCharacteristic("battery_level");
            const value = await characteristic.readValue();
            setBattery(value.getUint8(0));
        } catch {
            // The device simply does not expose a battery service.
        }
    }

    async function requestDevice() {
        if (!supported) {
            raise("Web Bluetooth недоступен в этом браузере. Попробуйте Chrome, Edge или Opera на десктопе или Android.");
            return;
        }

        setError(null);
        setPhase("requesting");

        try {
            const selected = await navigator.bluetooth!.requestDevice({
                acceptAllDevices: true,
                optionalServices: ["battery_service", "device_information"],
            });

            pairedDevice = selected;
            setDevice({name: selected.name || "Безымянное устройство", id: selected.id});
            selected.addEventListener("gattserverdisconnected", handleDisconnected);

            setPhase("connecting");
            const server = await selected.gatt?.connect();

            if (!server) {
                throw new Error("Устройство не предоставляет GATT-сервер для подключения.");
            }

            setPhase("connected");
            void readBattery(server);
        } catch (err) {
            setPhase("idle");
            setBattery(null);
            raise(describeError(err));
        }
    }

    function disconnect() {
        try {
            pairedDevice?.gatt?.disconnect();
        } catch (err) {
            raise(describeError(err));
        }

        setPhase("idle");
        setBattery(null);
    }

    function onPrimaryAction() {
        if (busy) {
            return;
        }

        if (connected) {
            disconnect();
            return;
        }

        void requestDevice();
    }

    return (
        <section className="bluetooth">
            <header className="bluetooth__header">
                <p className="bluetooth__eyebrow">
                    Консоль устройства
                </p>

                <h2 className="bluetooth__heading">
                    <span className="bluetooth__heading-accent">Bluetooth</span> подключение
                </h2>
            </header>

            <div className="bluetooth__radar">
                <div className="bluetooth__radar-stage">
                    {[1, 0.72, 0.46].map((scale) => (
                        <span
                            key={scale}
                            aria-hidden
                            className="bluetooth__radar-ring"
                            style={{width: `${scale * 100}%`, height: `${scale * 100}%`}}
                        />
                    ))}

                    {[0, 0.7, 1.4, 2.1].map((delay) => (
                        <span
                            key={delay}
                            aria-hidden
                            className={`bluetooth__radar-ripple ${busy || connected ? "bluetooth__radar-ripple--active" : ""}`}
                            style={{animationDelay: `${delay}s`}}
                        />
                    ))}

                    <div
                        aria-hidden
                        className={`bluetooth__radar-glow ${busy ? "bluetooth__radar-glow--busy" : connected ? "bluetooth__radar-glow--connected" : ""}`}
                    />

                    <div
                        aria-hidden
                        className={`bluetooth__radar-scan ${busy ? "bluetooth__radar-scan--active" : ""}`}
                    />

                    <button
                        type="button"
                        onClick={onPrimaryAction}
                        aria-busy={busy}
                        aria-pressed={connected}
                        disabled={busy}
                        className={`bluetooth__action glass ${busy ? "bluetooth__action--busy" : ""} ${connected ? "bluetooth__action--connected" : ""}`}
                    >
                        {!supported ? (
                            <BluetoothOffIcon className="bluetooth__action-icon bluetooth__action-icon--off"/>
                        ) : connected ? (
                            <BluetoothConnectedIcon className="bluetooth__action-icon bluetooth__action-icon--connected"/>
                        ) : (
                            <BluetoothIcon
                                className={`bluetooth__action-icon ${busy ? "bluetooth__action-icon--busy" : ""}`}
                            />
                        )}

                        <span className={`bluetooth__action-label ${busy || connected ? "bluetooth__action-label--active" : ""}`}>
                            {!supported
                                ? "Недоступно"
                                : phase === "requesting"
                                    ? "Поиск"
                                    : phase === "connecting"
                                        ? "Соединение"
                                        : connected
                                            ? "Отключить"
                                            : "Подключить"}
                        </span>

                        {busy && (
                            <span className="bluetooth__action-dots" aria-hidden>
                                {[0, 1, 2].map((dot) => (
                                    <span
                                        key={dot}
                                        className="bluetooth__action-dot"
                                        style={{animationDelay: `${dot * 0.22}s`}}
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
                <div className="bluetooth__toast" role="alert">
                    <TriangleAlertIcon className="bluetooth__toast-icon"/>

                    <p className="bluetooth__toast-text">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => setError(null)}
                        aria-label="Закрыть"
                        className="bluetooth__toast-close"
                    >
                        <XIcon className="bluetooth__toast-close-icon"/>
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

                        <span className={`bluetooth__device-badge ${connected ? "bluetooth__device-badge--connected" : ""}`}>
                            <span className={`bluetooth__device-badge-dot ${connected ? "bluetooth__device-badge-dot--connected" : ""}`}/>
                            {connected ? "Подключено" : "Отключено"}
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

                    {!connected && (
                        <button
                            type="button"
                            onClick={() => void requestDevice()}
                            className="bluetooth__device-reconnect"
                        >
                            <UnplugIcon className="bluetooth__device-reconnect-icon"/>
                            Переподключить
                        </button>
                    )}
                </div>
            )}

            <div className="bluetooth__telemetry">
                <Telemetry
                    icon={RadioIcon}
                    label="Статус"
                    value={!supported ? "—" : STATUS_LABELS[phase]}
                    active={busy || connected}
                    delay={0}
                />

                <Telemetry icon={WavesIcon} label="Протокол" value="BLE 5.3" delay={70}/>

                <Telemetry
                    icon={BatteryMediumIcon}
                    label="Батарея"
                    value={battery === null ? "—" : `${battery}%`}
                    active={battery !== null}
                    delay={140}
                />
            </div>
        </section>
    );
};

function Telemetry({icon: Icon, label, value, active = false, delay = 0}: ITelemetryItemProps) {
    return (
        <div
            className={`bluetooth-telemetry inner-hairline ${active ? "bluetooth-telemetry--active" : ""}`}
            style={{animationDelay: `${delay}ms`}}
        >
            <Icon className={`bluetooth-telemetry__icon ${active ? "bluetooth-telemetry__icon--active" : ""}`}/>

            <p className="bluetooth-telemetry__label">
                {label}
            </p>

            <p className={`bluetooth-telemetry__value tnum ${active ? "bluetooth-telemetry__value--active" : ""}`}>
                {value}
            </p>
        </div>
    );
}