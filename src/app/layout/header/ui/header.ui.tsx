import {observer} from "mobx-react-lite";
import {NavLink, type NavLinkRenderProps} from "react-router-dom";
import {GemIcon, UserRoundIcon} from "@/shared/components/icons";
import {cartStore} from "@/widgets/cart";
import {NAV_ITEMS} from "../model/header.data";
import "./header.styles.scss";

const getLinkClass = ({isActive}: NavLinkRenderProps): string => isActive ? "header__nav-link active" : "header__nav-link";

export const Header = observer(() => {
    const totalCount = cartStore.totalCount;

    return (
        <header className="header">
        <div className="header__top">
            <div className="header__brand">
                <div className="header__logo glass">
                    <GemIcon className="header__logo-icon"/>
                </div>

                <div>
                    <h1 className="header__title">
                        IQ Store
                    </h1>

                    <p className="header__subtitle">
                        Тестовый прототип · MVP
                    </p>
                </div>
            </div>

            <button
                className="header__user glass"
                type="button"
                aria-label="Профиль"
            >
                <UserRoundIcon className="header__user-icon"/>
            </button>
        </div>

        <nav className="header__nav glass" aria-label="Primary">
            <div className="header__nav-indicator" aria-hidden>
                <div className="header__nav-indicator-inner"/>
            </div>

            {NAV_ITEMS.map(({to, icon: Icon, label}) => (
                <NavLink
                    to={to}
                    className={getLinkClass}
                    key={to}
                >
                    <Icon className="header__nav-icon"/>
                    <span>{label}</span>

                    {to === "/cart" && totalCount > 0 && (
                        <span
                            aria-label={`В корзине товаров: ${totalCount}`}
                            className="header__cart-badge tnum"
                            key={totalCount}
                        >
                            {totalCount}
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>
    </header>
    );
});