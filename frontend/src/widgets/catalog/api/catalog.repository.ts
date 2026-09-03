import type {ICatalogData, ICatalogRepository} from "@/widgets/catalog";
import {type IProduct, ProductMapper} from "@/entities/product";
import type {ICategory} from "@/entities/category";
import {XmlParser} from "@/shared/api/xml";

export class CatalogRepository implements ICatalogRepository {
    async getCatalog(): Promise<ICatalogData> {
        const res = await fetch("/src/shared/api/mock/products.xml");

        if (!res.ok) {
            throw new Error(`[Ошибка загрузки XML]: ${res.statusText}`);
        }

        const xmlText = await res.text();
        const xmlDoc = XmlParser.parseFromString(xmlText);

        const categoriesNodes = xmlDoc.getElementsByTagName("category");
        const categories: ICategory[] = [];
        for (let i = 0; i < categoriesNodes.length; i++) {
            categories.push(ProductMapper.toCategory(categoriesNodes[i]));
        }

        const offerNodes = xmlDoc.getElementsByTagName("offer");
        const products: IProduct[] = [];
        for (let i = 0; i < offerNodes.length; i++) {
            products.push(ProductMapper.toProduct(offerNodes[i]));
        }

        return { products, categories };
    }
}