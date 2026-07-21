import {createBrowserRouter, Outlet, Navigate} from "react-router";
import {AppLayout} from "../layouts/app-layout";

export const routes = createBrowserRouter([
    {
        element: (
            <AppLayout>
                <Outlet />
            </AppLayout>
        ),
        children: [
            { path: "/", element: <Navigate to="/catalog" replace /> },
            { path: "/catalog", element: <div>Catalog</div> },
            { path: "/cart", element: <div>Cart</div> },
            { path: "/bluetooth", element: <div>Bluetooth</div> },
        ]
    },
])