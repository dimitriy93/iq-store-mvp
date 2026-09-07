import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {NavLink, type NavLinkRenderProps} from "react-router-dom";
import {GemIcon, TrashIcon, UserRoundIcon} from "@/shared/components/icons";
import {NAV_ITEMS} from "../model/header.data";
import {cartStore} from "@/widgets/cart";
import "./header.styles.scss";

const getLinkClass = ({isActive}: NavLinkRenderProps): string => isActive ? "header__nav-link active" : "header__nav-link";

export const Header = observer(() => {
    const totalCount = cartStore.totalCount;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isUserMenuOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
            }
        };

        const handlePointerDown = (event: PointerEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isUserMenuOpen]);

    const handleClearOrders = () => {
        setIsUserMenuOpen(false);
    };

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

            <div className="header__user-wrap" ref={userMenuRef}>
                <button
                    className="header__user glass"
                    type="button"
                    onClick={() => setIsUserMenuOpen(isOpen => !isOpen)}
                >
                    <UserRoundIcon className="header__user-icon"/>
                </button>

                {isUserMenuOpen && (
                    <div className="header__user-menu glass">
                        <button
                            className="header__user-menu-item"
                            type="button"
                            onClick={handleClearOrders}
                        >
                            <TrashIcon className="header__user-menu-item-icon"/>
                            <span>Очистить историю заказов</span>
                        </button>
                    </div>
                )}
            </div>
        </div>

        <nav className="header__nav glass">
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