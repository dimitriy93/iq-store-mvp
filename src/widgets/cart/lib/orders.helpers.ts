import type {IOrder} from "@/widgets/cart";

export const ORDERS_STORAGE_KEY = "iq-store-orders";

export const isValidOrder = (value: unknown): value is IOrder => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const order = value as Record<string, unknown>;

    return typeof order.id === "string"
        && typeof order.customerName === "string"
        && Array.isArray(order.items)
        && typeof order.totalCount === "number"
        && typeof order.totalPrice === "number"
        && typeof order.createdAt === "string";
};

export const readStoredOrders = (): IOrder[] => {
    try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(isValidOrder);
    } catch {
        return [];
    }
};