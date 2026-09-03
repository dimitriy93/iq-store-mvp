import {useEffect, useState} from "react";
import {getProductImage, type IProductCardProps} from "@/entities/product";
import {CheckIcon, PlusIcon} from "@/shared/components/icons";
import "./product.styles.scss";

const ADDED_FEEDBACK_MS = 1200;

export const ProductCard = ({product, onAddToCart}: IProductCardProps) => {
    const {name, price, id, available} = product;
    const image = getProductImage(id);
    const [justAdded, setJustAdded] = useState(false);

    useEffect(() => {
        if (!justAdded) {
            return;
        }

        const timer = window.setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);

        return () => window.clearTimeout(timer);
    }, [justAdded]);

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
        setJustAdded(true);
    };

    return (
        <article className="product-card">
            <div className="product-card__body inner-hairline">
                <div className="product-card__plate">
                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                    />
                </div>

                <div className="product-card__copy">
                    <h3>{name}</h3>

                    <p className="product-card__price tnum">
                        {price} ₽
                    </p>
                </div>

                <button
                    className={justAdded ? "product-card__button product-card__button--added" : "product-card__button"}
                    disabled={!available}
                    onClick={handleAddToCart}
                >
                    {available && (
                        justAdded
                            ? <CheckIcon className="product-card__button-icon"/>
                            : <PlusIcon className="product-card__button-icon"/>)
                    }
                    {available ? (justAdded ? "Добавлено" : "Добавить") : "Нет в наличии"}
                </button>
            </div>
        </article>
    );
};