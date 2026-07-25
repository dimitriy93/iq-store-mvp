export interface IProduct {
    id: string;
    available: boolean;
    name: string;
    price: number;
    picture?: string;
    description?: string;
    categoryId: number;
}