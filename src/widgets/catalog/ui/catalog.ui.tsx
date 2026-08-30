import {Fragment, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {CatalogPagination} from "./catalog-pagination.ui.tsx";
import {ProductSkeleton} from "./catalog-skeleton.ui.tsx";
import {catalogStore} from "@/widgets/catalog";
import {cartStore} from "@/widgets/cart";
import {ProductCard} from "@/entities/product";
import "./catalog.styles.scss";

const SKELETON_COUNT = 6;

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
                    {catalogStore.isLoading ? "—" : `${productCount} позиций`}
                </p>
            </header>

            {catalogStore.breadcrumbs.length > 0 && (
                <nav className="catalog__breadcrumbs" aria-label="Навигация по категориям">
                    {catalogStore.breadcrumbs.map((crumb, index) => {
                        const isLast = index === catalogStore.breadcrumbs.length - 1;

                        return (
                            <Fragment key={crumb.id}>
                                {index > 0 && (
                                    <span className="catalog__breadcrumbs-separator">
                                        /
                                    </span>
                                )}

                                {isLast ? (
                                    <span className="catalog__breadcrumbs-current">
                                        {crumb.name}
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="catalog__breadcrumbs-link"
                                        onClick={() => catalogStore.selectCategory(crumb.id)}
                                    >
                                        {crumb.name}
                                    </button>
                                )}
                            </Fragment>
                        );
                    })}
                </nav>
            )}

            {catalogStore.childCategories.length > 0 && (
                <div className="catalog__filter">
                    <label htmlFor="category">
                        Категория
                    </label>

                    <select
                        id="category"
                        value={catalogStore.selectedCategoryId || ""}
                        onChange={(event) => {
                            const value = event.target.value;

                            if (!value) {
                                catalogStore.resetCategory();
                                return;
                            }

                            catalogStore.selectCategory(value);
                        }}
                    >
                        <option value="">
                            Все категории
                        </option>

                        {catalogStore.childCategories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
