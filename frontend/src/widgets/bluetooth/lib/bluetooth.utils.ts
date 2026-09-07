export const isSupported = (): boolean => typeof navigator !== "undefined" && !!navigator.bluetooth;

export const describeError = (error: unknown): string => {
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