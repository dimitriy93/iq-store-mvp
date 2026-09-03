import type {ICategory} from "@/entities/category";
import type {IProduct} from "@/entities/product";

export interface ICatalogData {
    products: IProduct[];
    categories: ICategory[];
}

export interface ICatalogRepository {
    getCatalog(): Promise<ICatalogData>
}