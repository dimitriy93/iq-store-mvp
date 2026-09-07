import type {ICatalogData, ICatalogRepository} from "@/widgets/catalog";

export class CatalogRepository implements ICatalogRepository {
    async getCatalog(): Promise<ICatalogData> {
        const res = await fetch("/api/catalog");

        if (!res.ok) {
            throw new Error(`[Ошибка загрузки каталога]: ${res.statusText}`);
        }

        return await res.json() as ICatalogData;
    }
}