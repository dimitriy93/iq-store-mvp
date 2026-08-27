import {Link} from "react-router-dom";
import {ArrowRightIcon, CartIcon} from "@/shared/components/icons";
import "./cart.styles.scss";

const formatCount = (value: number): string => String(value).padStart(2, "0");

export const CartPage = () => (
    <section className="cart">
        <header className="cart__header">
            <div>
                <p className="cart__eyebrow">
                    Ваша подборка
                </p>

                <h2 className="cart__heading">
                    <span className="cart__heading-accent">Корзина</span>
                </h2>
            </div>

            <p className="cart__count tnum">
                {formatCount(0)} товаров
            </p>
        </header>

        <div className="cart__empty">
            <div className="cart__empty-icon-wrap">
                <div className="cart__empty-glow" aria-hidden/>

                <div className="cart__empty-icon glass">
                    <CartIcon className="cart__empty-icon-svg"/>
                </div>
            </div>

            <h3 className="cart__empty-title">
                Пока ничего не выбрано
            </h3>

            <p className="cart__empty-text">
                Товары, добавленные из каталога, появятся здесь и будут готовы к оформлению заказа.
            </p>

            <Link to="/catalog" className="cart__empty-button">
                Перейти в каталог
                <ArrowRightIcon className="cart__empty-button-icon"/>
            </Link>
        </div>
    </section>
);