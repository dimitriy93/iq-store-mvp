import type {TPhase} from "@/widgets/bluetooth/model/bluetooth.types.ts";

export const STATUS_LABELS: Record<TPhase, string> = {
    idle: "Ожидание",
    requesting: "Поиск",
    connecting: "Соединение",
    connected: "На связи",
};

export const STATUS_TEXTS: Record<"unsupported" | TPhase, string> = {
    unsupported: "В этом браузере нет Web Bluetooth. Его поддерживают Chrome, Edge и Opera.",
    idle: "Нажмите на маячок, чтобы открыть системный выбор устройства.",
    requesting: "Ожидаем выбор устройства в системном окне…",
    connecting: "Согласуем GATT-рукопожатие…",
    connected: "Соединение установлено. Телеметрия активна.",
};