import {Link} from "react-router-dom";
import {cartStore} from "@/widgets/cart";
import {useState} from "react";
import {getProductImage} from "@/entities/product";
import {observer} from "mobx-react-lite";
import {formatDate, formatPrice} from "../lib/cart.utils";
import {ArrowRightIcon, CartIcon, CheckIcon, MinusIcon, PlusIcon, XIcon} from "@/shared/components/icons";
import "./cart.styles.scss";

export const CartPage = observer(() => {
    const [showNameError, setShowNameError] = useState(false);
    const {items, orders, lastOrderId} = cartStore;

    const handleCheckout = () => {
        if (!cartStore.customerName.trim()) {
            setShowNameError(true);
            return;
        }

        cartStore.checkout();
        setShowNameError(false);
    };

    return (
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
                    {cartStore.totalCount} товаров
                </p>
            </header>

            {lastOrderId && (
                <div className="cart__success glass" role="status">
                    <div className="cart__success-icon">
                        <CheckIcon className="cart__success-icon-svg"/>
                    </div>

                    <div className="cart__success-copy">
                        <h3>
                            Заказ оформлен
                        </h3>

                        <p>
                            Спасибо! Информация о заказе сохранена ниже в истории заказов.
                        </p>
                    </div>

                    <button
                        className="cart__success-close"
                        type="button"
                        aria-label="Закрыть"
                        onClick={() => cartStore.dismissSuccess()}
                    >
                        <XIcon className="cart__success-close-icon"/>
                    </button>
                </div>
            )}

            {items.length === 0 && (
                <div className="cart__empty">
                    <div className="cart__empty-icon-wrap">
                        <div className="cart__empty-glow" aria-hidden/>

                        <div className="cart__empty-icon glass">
                            <CartIcon className="cart__empty-icon-svg"/>
                        </div>
                    </div>

                    <h3 className="cart__empty-title">
                        Корзина пуста
                    </h3>

                    <p className="cart__empty-text">
                        Добавьте товары из каталога, чтобы оформить заказ.
                    </p>

                    <Link to="/catalog" className="cart__empty-button">
                        Перейти в каталог
                        <ArrowRightIcon className="cart__empty-button-icon"/>
                    </Link>
                </div>
            )}

            {items.length > 0 && (
                <div className="cart__content">
                    <ul className="cart__items">
                        {items.map(({product, quantity}) => (
                            <li
                                className="cart__item inner-hairline"
                                key={product.id}
                            >
                                <div className="cart__item-plate">
                                    <img
                                        src={getProductImage(product.id)}
                                        alt={product.name}
                                        loading="lazy"
                                    />
                                </div>

                                <div className="cart__item-copy">
                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p className="cart__item-price tnum">
                                        {formatPrice(product.price)} ₽
                                    </p>
                                </div>

                                <div className="cart__item-qty">
                                    <button
                                        className="cart__item-qty-button"
                                        type="button"
                                        aria-label="Уменьшить количество"
                                        onClick={() => cartStore.decrementQuantity(product.id)}
                                    >
                                        <MinusIcon className="cart__item-qty-icon"/>
                                    </button>

                                    <span className="cart__item-qty-value tnum">
                                    {quantity}
                                </span>

                                    <button
                                        className="cart__item-qty-button"
                                        type="button"
                                        aria-label="Увеличить количество"
                                        onClick={() => cartStore.incrementQuantity(product.id)}
                                    >
                                        <PlusIcon className="cart__item-qty-icon"/>
                                    </button>
                                </div>

                                <button
                                    className="cart__item-remove"
                                    type="button"
                                    aria-label="Удалить из корзины"
                                    onClick={() => cartStore.removeProduct(product.id)}
                                >
                                    <XIcon className="cart__item-remove-icon"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart__summary glass">
                        <div className="cart__summary-row">
                        <span>
                            Товаров
                        </span>

                            <span className="tnum">
                            {cartStore.totalCount}
                        </span>
                        </div>

                        <div className="cart__summary-row cart__summary-row--total">
                        <span>
                            Итого
                        </span>

                            <span className="tnum">
                            {formatPrice(cartStore.totalPrice)} ₽
                        </span>
                        </div>

                        <div className="cart__summary-field">
                            <label htmlFor="customer-name">
                                Имя
                            </label>

                            <input
                                id="customer-name"
                                type="text"
                                placeholder="Введите ваше имя"
                                value={cartStore.customerName}
                                onChange={(event) => {
                                    cartStore.setCustomerName(event.target.value);
                                    setShowNameError(false);
                                }}
                            />

                            {showNameError && (
                                <p className="cart__summary-field-error">
                                    Введите имя, чтобы оформить заказ.
                                </p>
                            )}
                        </div>

                        <button
                            className="cart__summary-button"
                            type="button"
                            onClick={handleCheckout}
                        >
                            Оформить
                        </button>
                    </div>
                </div>
            )}


            <section className="cart__orders">
                <h3 className="cart__orders-title">
                    История заказов
                </h3>

                {orders.length === 0 ? (
                    <p className="cart__orders-empty">
                        Заказов пока нет
                    </p>
                ) : (
                    <ul className="cart__orders-list">
                        {orders.map((order) => (
                            <li
                                className="cart__order inner-hairline"
                                key={order.id}
                            >
                                <div className="cart__order-head">
                                    <span className="cart__order-id">
                                        Заказ №{order.id.slice(0, 8)}
                                    </span>

                                    <span className="cart__order-date">
                                        {formatDate(order.createdAt)}
                                    </span>
                                </div>

                                <div className="cart__order-foot">
                                    <span>
                                        {order.customerName} · {order.totalCount} поз.
                                    </span>

                                    <span className="cart__order-total tnum">
                                        {formatPrice(order.totalPrice)} ₽
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </section>
    );
});