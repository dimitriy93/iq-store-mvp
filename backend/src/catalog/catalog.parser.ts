import { XMLParser } from "fast-xml-parser";
import {type ICatalogData, type ICategory, type IProduct, type IRawShop, IXMLDocument} from "./catalog.types.js";
import {toArray, toBoolean, toNumber, toTrimmedString} from "./catalog.utils.js";

const extractXmlText = (node: unknown): string => {
    if (node && typeof node === "object" && "#text" in node) {
        const nestedText = (node as Record<string, unknown>)["#text"];
        return toTrimmedString(nestedText);
    }
    return toTrimmedString(node);
};

export const parseCatalogXml = (xmlText: string): ICatalogData => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
    });

    let doc: IXMLDocument;
    try {
        doc = parser.parse(xmlText);
    } catch {
        throw new Error("Ошибка валидации XML");
    }

    const shop = doc?.yml_catalog?.shop;
    if (!shop) {
        throw new Error("Ошибка валидации XML");
    }

    const categories: ICategory[] = toArray(shop.categories?.category).map((category) => ({
        id: category["@_id"] || "",
        name: extractXmlText(category["#text"]),
        parentId: category["@_parentId"],
    }));

    const products: IProduct[] = toArray(shop.offers?.offer).map((offer) => ({
        id: offer["@_id"] || "",
        available: toBoolean(offer["@_available"]),
        name: toTrimmedString(offer.name),
        price: toNumber(offer.price),
        categoryId: toNumber(offer.categoryId),
        picture: toTrimmedString(offer.picture),
        description: toTrimmedString(offer.description),
    }));

    return { products, categories };
};
