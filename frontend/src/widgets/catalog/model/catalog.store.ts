import {makeAutoObservable} from "mobx";
import type {IProduct} from "@/entities/product";
import type {ICategory} from "@/entities/category";
import {
    findRootCategory,
    getCategoryChain,
    getCategoryChildren,
    getCategoryDescendantIds
} from "@/entities/category";
import {CatalogRepository, type ICatalogRepository} from "@/widgets/catalog";

export class CatalogStore {
    products: IProduct[] = [];
    categories: ICategory[] = [];
    isLoading: boolean = false;
    error: string | null = null;
    selectedCategoryId: string | null = null;
    currentPage: number = 1;

    readonly itemsPerPage: number = 10;
    private readonly repository: ICatalogRepository;

    constructor(repository: ICatalogRepository) {
        makeAutoObservable(this);
        this.repository = repository;
    }

    get rootCategory(): ICategory | undefined {
        return findRootCategory(this.categories);
    }

    get currentCategory(): ICategory | null {
        if (!this.selectedCategoryId) {
            return null;
        }

        return this.categories.find(category => category.id === this.selectedCategoryId) || null;
    }

    get breadcrumbs(): ICategory[] {
        if (this.currentCategory) {
            return getCategoryChain(this.categories, this.currentCategory.id);
        }

        return this.rootCategory ? [this.rootCategory] : [];
    }

    get childCategories(): ICategory[] {
        const parentId = this.selectedCategoryId || this.rootCategory?.id;

        if (!parentId) {
            return [];
        }

        return getCategoryChildren(this.categories, parentId);
    }

    get filteredProducts(): IProduct[] {
        const categoryId = this.selectedCategoryId || this.rootCategory?.id;

        if (!categoryId) {
            return this.products;
        }

        const categoryIds = getCategoryDescendantIds(this.categories, categoryId);

        return this.products.filter(product => categoryIds.has(String(product.categoryId)));
    }

    get paginatedProducts(): IProduct[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return this.filteredProducts.slice(startIndex, endIndex);
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
    }

    *loadCatalog() {
        this.isLoading = true;
        this.error = null;

        try {
            const { products, categories } = yield this.repository.getCatalog();
            this.products = products;
            this.categories = categories;
            this.resetCategory();
        } catch (error) {
            this.error = error instanceof Error ? error.message : "Ошибка загрузки каталога";
            console.error(`[Catalog Store]: ${error}`);
        } finally {
            this.isLoading = false;
        }
    }

    selectCategory(categoryId: string | null) {
        this.selectedCategoryId = categoryId;
        this.currentPage = 1;
    }

    resetCategory() {
        this.selectCategory(null);
    }

    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }
}

export const catalogStore = new CatalogStore(new CatalogRepository());