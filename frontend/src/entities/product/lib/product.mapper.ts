import type {IProduct} from "@/entities/product";
import type {ICategory} from "@/entities/category";
import {getXmlValue} from "@/shared/api/xml";

export class ProductMapper {
    static toCategory(element: Element): ICategory {
        return {
            id: getXmlValue(element, "id", "string", true),
            name: element.textContent?.trim() || "",
            parentId: getXmlValue(element, "parentId", "undefined", true),
        };
    }

    static toProduct(element: Element): IProduct {
        return {
            id: getXmlValue(element, "id", "string", true),
            available: getXmlValue(element, "available", "boolean", true),
            name: getXmlValue(element, "name", "string"),
            price: getXmlValue(element, "price", "number"),
            categoryId: getXmlValue(element, "categoryId", "number"),
            picture: getXmlValue(element, "picture", "string"),
            description: getXmlValue(element, "description", "string"),
        }
    }
}