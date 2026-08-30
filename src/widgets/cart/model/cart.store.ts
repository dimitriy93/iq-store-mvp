import type {IProduct} from "@/entities/product";
import {computed, makeAutoObservable} from "mobx";
import type {ICartItem, IOrder, IOrderItem} from "./cart.types";

const ORDERS_STORAGE_KEY = "iq-store-orders";
const MIN_QUANTITY = 1;

const isValidOrder = (value: unknown): value is IOrder => {
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

const readStoredOrders = (): IOrder[] => {
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

export class CartStore {
    items: ICartItem[] = [];
    customerName: string = "";
    orders: IOrder[] = readStoredOrders();
    lastOrderId: string | null = null;

    constructor() {
        makeAutoObservable(this, {
            totalCount: computed,
            totalPrice: computed,
        });
    }

    get totalCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    get totalPrice(): number {
        return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    addProduct(product: IProduct) {
        const existingItem = this.items.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
            return;
        }

        this.items.push({product, quantity: 1});
    }

    incrementQuantity(productId: string) {
        const item = this.items.find(cartItem => cartItem.product.id === productId);

        if (item) {
            item.quantity += 1;
        }
    }

    decrementQuantity(productId: string) {
        const item = this.items.find(cartItem => cartItem.product.id === productId);

        if (!item) {
            return;
        }

        if (item.quantity <= MIN_QUANTITY) {
            this.removeProduct(productId);
            return;
        }

        item.quantity -= 1;
    }

    removeProduct(productId: string) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    setCustomerName(name: string) {
        this.customerName = name;
    }

    checkout() {
        const customerName = this.customerName.trim();

        if (!customerName || this.items.length === 0) {
            return;
        }

        const orderItems: IOrderItem[] = this.items.map(({product, quantity}) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
        }));

        const order: IOrder = {
            id: crypto.randomUUID(),
            customerName,
            items: orderItems,
            totalCount: this.totalCount,
            totalPrice: this.totalPrice,
            createdAt: new Date().toISOString(),
        };

        this.orders = [order, ...this.orders];
        this.saveOrders();
        this.lastOrderId = order.id;
        this.items = [];
        this.customerName = "";
    }

    dismissSuccess() {
        this.lastOrderId = null;
    }

    clearOrders() {
        this.orders = [];
        this.saveOrders();
    }

    private saveOrders() {
        try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
        } catch (error) {
            console.error(`[Cart Store]: ${error}`);
        }
    }
}

export const cartStore = new CartStore();