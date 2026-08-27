import {getProductImage, type IProductCardProps} from "@/entities/product";
import {PlusIcon} from "@/shared/components/icons";
import "./product.styles.scss";

export const ProductCard = ({product}: IProductCardProps) => {
    const {name, price, id, available} = product;
    const image = getProductImage(id);

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
                    className="product-card__button"
                    disabled={!available}
                >
                    {available && <PlusIcon className="product-card__button-icon"/>}
                    {available ? "Добавить" : "Нет в наличии"}
                </button>
            </div>
        </article>
    );
};