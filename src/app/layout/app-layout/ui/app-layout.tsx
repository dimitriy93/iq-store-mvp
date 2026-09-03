import type {ReactNode} from "react";
import {useLocation} from "react-router-dom";
import {Header} from "@/app/layout/header";
import "./app-layout.styles.scss";

interface IAppLayoutProps {
    children?: ReactNode
}

export const AppLayout = ({children}: IAppLayoutProps) => {
    const {pathname} = useLocation();

    return (
        <div className="app">
            <div className="app__backdrop" aria-hidden>
                <div className="app__orb app__orb--neon"/>
                <div className="app__orb app__orb--gold"/>
                <div className="app__orb app__orb--center"/>
                <div className="app__grid"/>
            </div>

            <div className="app__frame">
                <Header/>

                <main className="app__main no-scrollbar">
                    <div className="app__page" key={pathname}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};