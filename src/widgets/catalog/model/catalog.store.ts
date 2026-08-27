import type {IProduct} from "@/entities/product";
import {CatalogRepository, type ICatalogRepository} from "@/widgets/catalog";
import type {ICategory} from "@/entities/category";
import {computed, makeAutoObservable} from "mobx";

export class CatalogStore {
    products: IProduct[] = [];
    categories: ICategory[] = [];
    isLoading: boolean = false;
    error: string | null = null;
    selectedCategoryId: number | null = null;
    currentPage: number = 1;

    readonly itemsPerPage: number = 12;
    private readonly repository: ICatalogRepository;

    constructor(repository: ICatalogRepository) {
        makeAutoObservable(this, {
            filteredProducts: computed,
            paginatedProducts: computed,
            totalPages: computed,
        });
        this.repository = repository;
    }

    get filteredProducts(): IProduct[] {
        if (!this.selectedCategoryId) {
            return this.products;
        }

        return this.products.filter(
            product => product.categoryId === this.selectedCategoryId
        );
    }

    get paginatedProducts(): IProduct[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return this.filteredProducts.slice(startIndex, endIndex);
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
    }

    async loadCatalog(): Promise<void> {
        this.isLoading = true;
        this.error = null;

        try {
            const { products, categories } = await this.repository.getCatalog();
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

    selectCategory(categoryId: number) {
        this.selectedCategoryId = categoryId;
        this.currentPage = 1;
    }

    resetCategory() {
        this.selectedCategoryId = null;
        this.currentPage = 1;
    }

    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }
}

export const catalogStore = new CatalogStore(new CatalogRepository());