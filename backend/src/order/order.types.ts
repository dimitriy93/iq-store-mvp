export interface ICreateOrderItemInput {
    productId: string;
    quantity: number;
}

export interface ICreateOrderInput {
    items: ICreateOrderItemInput[];
}

export interface IOrderItems {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}