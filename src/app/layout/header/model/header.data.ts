import type {ComponentType} from "react";
import {BluetoothIcon, CartIcon, CatalogIcon} from "@/shared/components/icons";

interface INavItem {
    to: string;
    label: string;
    icon: ComponentType;
}

export const NAV_ITEMS: INavItem[] = [
    {to: "/catalog", label: "Каталог", icon: CatalogIcon},
    {to: "/cart", label: "Корзина", icon: CartIcon},
    {to: "/bluetooth", label: "Bluetooth", icon: BluetoothIcon}
]