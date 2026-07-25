import type {IProduct} from "@/entities/product";
import type {ICategory} from "@/entities/category";

export interface ICatalogData {
    products: IProduct[];
    categories: ICategory[];
}

export interface ICatalogRepository {
    getCatalog(): Promise<ICatalogData>
}