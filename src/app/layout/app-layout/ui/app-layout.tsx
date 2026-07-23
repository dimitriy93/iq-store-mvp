import type {ReactNode} from "react";
import {Header} from "@/app/layout/header";

interface IAppLayoutProps {
    children?: ReactNode
}

export const AppLayout = ({ children }: IAppLayoutProps) => (
    <div className="app">
        <Header />
        { children }
    </div>
)