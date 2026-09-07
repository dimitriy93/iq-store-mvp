import type {IProduct} from "@/entities/product";

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder {
    id: number;
    createdAt: string;
    total: number;
    items: IOrderItem[];
}

export interface IOrdersResponse {
    items: IOrder[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ICreateOrderPayload {
    items: Array<{productId: string; quantity: number}>;
}

export interface IOrderResponse {
    id: number;
    total: number;
}