import type {ReactNode} from "react";
import {Header} from "@/app/layouts/header";

interface IAppLayoutProps {
    children?: ReactNode
}

export const AppLayout = ({ children }: IAppLayoutProps) => (
    <div className="app">
        <Header />
        { children }
    </div>
)