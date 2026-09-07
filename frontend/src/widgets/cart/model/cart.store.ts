import {makeAutoObservable} from "mobx";
import type {IProduct} from "@/entities/product";
import {cartRepository} from "../api/cart.repository";
import type {ICartItem, IOrder, IOrderResponse, IOrdersResponse} from "./cart.types";

export class CartStore {
    items: ICartItem[] = [];
    customerName: string = "";
    orders: IOrder[] = [];
    ordersPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    };
    isLoadingOrders: boolean = false;
    ordersError: string | null = null;
    lastOrderId: number | null = null;
    isSubmitting: boolean = false;
    checkoutError: string | null = null;
    isDeletingOrders: boolean = false;
    ordersDeleteError: string | null = null;

    constructor() {
        makeAutoObservable(this);
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

        if (item.quantity <= 1) {
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

    *checkout(): Generator<Promise<unknown>, void, IOrderResponse> {
        if (this.items.length === 0 || this.isSubmitting) {
            return;
        }

        this.checkoutError = null;
        this.isSubmitting = true;

        try {
            const payload = {
                items: this.items.map(({product, quantity}) => ({
                    productId: product.id,
                    quantity,
                })),
            };

            const response = yield cartRepository.createOrder(payload);

            this.lastOrderId = response.id;
            this.items = [];
            this.customerName = "";
            this.isSubmitting = false;

            this.loadOrders(1);
        } catch {
            this.checkoutError = "Не удалось оформить заказ. Попробуйте ещё раз.";
            this.isSubmitting = false;
        }
    }

    dismissSuccess() {
        this.lastOrderId = null;
    }

    clearCheckoutError() {
        this.checkoutError = null;
    }

    *loadOrders(page = 1) {
        this.isLoadingOrders = true;
        this.ordersError = null;

        try {
            const response: IOrdersResponse = yield cartRepository.getOrders(page, 10);

            this.orders = response.items;
            this.ordersPagination = response.pagination;
        } catch {
            this.ordersError = "Не удалось загрузить историю заказов.";
        } finally {
            this.isLoadingOrders = false;
        }
    }

    *clearOrders() {
        if (this.isDeletingOrders) {
            return;
        }

        this.isDeletingOrders = true;
        this.ordersDeleteError = null;

        try {
            yield cartRepository.clearOrders();

            this.orders = [];
            this.ordersPagination = {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            };
        } catch {
            this.ordersDeleteError = "Не удалось удалить историю заказов.";
        } finally {
            this.isDeletingOrders = false;
        }
    }
}

export const cartStore = new CartStore();
