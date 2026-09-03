export const formatPrice = (value: number): string => value.toLocaleString("ru-RU");
export const formatDate = (value: string): string =>
    new Date(value).toLocaleString("ru-RU", {day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"});