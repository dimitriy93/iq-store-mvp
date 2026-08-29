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
    id: string;
    customerName: string;
    items: IOrderItem[];
    totalCount: number;
    totalPrice: number;
    createdAt: string;
}