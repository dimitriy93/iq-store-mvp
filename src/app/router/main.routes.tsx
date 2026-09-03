import {createBrowserRouter, Outlet, Navigate} from "react-router";
import {BluetoothPage} from "@/widgets/bluetooth";
import {AppLayout} from "../layout/app-layout";
import {CatalogPage} from "@/widgets/catalog";
import {CartPage} from "@/widgets/cart";

export const routes = createBrowserRouter([
    {
        element: (
            <AppLayout>
                <Outlet />
            </AppLayout>
        ),
        children: [
            { path: "/", element: <Navigate to="/catalog" replace /> },
            { path: "/catalog", element: <CatalogPage/> },
            { path: "/cart", element: <CartPage/> },
            { path: "/bluetooth", element: <BluetoothPage/> },
        ]
    },
])