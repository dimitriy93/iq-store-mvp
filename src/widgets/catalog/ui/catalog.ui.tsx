import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {CatalogPagination} from "./catalog-pagination.ui.tsx";
import {ProductSkeleton} from "./catalog-skeleton.ui.tsx";
import {catalogStore} from "@/widgets/catalog";
import {cartStore} from "@/widgets/cart";
import {ProductCard} from "@/entities/product";
import "./catalog.styles.scss";

const SKELETON_COUNT = 6;

const formatCount = (value: number): string => (value === 0 ? "0" : String(value).padStart(2, "0"));

export const CatalogPage = observer(() => {
    useEffect(() => {
        catalogStore.loadCatalog();
    }, []);

    const productCount = catalogStore.filteredProducts.length;

    return (
        <section className="catalog">
            <header className="catalog__header">
                <div>
                    <p className="catalog__eyebrow">
                        Подобрано для вас
                    </p>

                    <h2 className="catalog__heading">
                        Весь <span className="catalog__heading-accent">каталог</span>
                    </h2>
                </div>

                <p className="catalog__count tnum">
                    {catalogStore.isLoading ? "—" : `${formatCount(productCount)} позиций`}
                </p>
            </header>

            <div className="catalog__filter">
                <label htmlFor="category">
                    Категория
                </label>

                <select
                    id="category"
                    value={catalogStore.selectedCategoryId ?? ""}
                    onChange={(event) => {
                        const value = event.target.value;

                        if (!value) {
                            catalogStore.resetCategory();
                            return;
                        }

                        catalogStore.selectCategory(Number(value));
                    }}
                >
                    <option value="">
                        Все категории
                    </option>

                    {catalogStore.categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {catalogStore.error && (
                <div className="catalog__error" role="alert">
                    {catalogStore.error}
                </div>
            )}

            <div className="catalog__grid">
                {catalogStore.isLoading
                    ? Array.from({length: SKELETON_COUNT}).map((_, index) => (
                        <ProductSkeleton key={index} index={index}/>
                    ))
                    : catalogStore.paginatedProducts.map((product, index) => (
                        <ProductCard
                            key={`${product.id}-${index}`}
                            product={product}
                            onAddToCart={cartProduct => cartStore.addProduct(cartProduct)}
                        />
                    ))}
            </div>

            {catalogStore.paginatedProducts.length === 0 && !catalogStore.isLoading && (
                <div className="catalog-empty">
                    <h2>Товары не найдены</h2>

                    <p>
                        Попробуйте выбрать другую категорию.
                    </p>
                </div>
            )}

            {catalogStore.totalPages > 1 && (
                <CatalogPagination
                    currentPage={catalogStore.currentPage}
                    totalPages={catalogStore.totalPages}
                    onPageChange={page => catalogStore.setPage(page)}
                />
            )}
        </section>
    );
});
