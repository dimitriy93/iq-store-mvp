import {NavLink, type NavLinkRenderProps} from "react-router-dom";
import {NAV_ITEMS} from "../model/header.data";
import "./header.styles.scss";

const getLinkClass = ({isActive}: NavLinkRenderProps): string => isActive ? "nav-link active" : "nav-link";

export const Header = () => (
    <header className="header">
        <div className="container">
            <nav className="header-nav">
                {NAV_ITEMS.map(({to, icon: Icon, label}) => (
                    <NavLink
                        to={to}
                        className={getLinkClass}
                        key={to}
                    >
                        <Icon/>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    </header>
);