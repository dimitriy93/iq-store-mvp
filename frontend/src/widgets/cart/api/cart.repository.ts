import type {ICreateOrderPayload, IOrdersResponse, IOrderResponse} from "../model/cart.types";

export class CartRepository {
    async createOrder(payload: ICreateOrderPayload): Promise<IOrderResponse> {
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Не удалось оформить заказ");
        }

        return await res.json() as IOrderResponse;
    }

    async getOrders(page: number, limit: number): Promise<IOrdersResponse> {
        const res = await fetch(`/api/orders?page=${page}&limit=${limit}`);

        if (!res.ok) {
            throw new Error("Не удалось загрузить историю заказов");
        }

        return await res.json() as IOrdersResponse;
    }
}

export const cartRepository = new CartRepository();
