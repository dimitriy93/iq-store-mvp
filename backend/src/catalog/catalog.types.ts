export interface ICategory {
    id: string;
    name: string;
    parentId?: string;
}

export interface IProduct {
    id: string;
    available: boolean;
    name: string;
    price: number;
    picture?: string;
    description?: string;
    categoryId: number;
}

export interface ICatalogData {
    products: IProduct[];
    categories: ICategory[];
}

export interface IRawCategory {
    "#text"?: string | { "#text": string };
    "@_id"?: string;
    "@_parentId"?: string;
}

export interface IRawOffer {
    "@_id"?: string;
    "@_available"?: string | boolean;
    name?: unknown;
    price?: unknown;
    categoryId?: unknown;
    picture?: unknown;
    description?: unknown;
}

export interface IRawShop {
    categories?: {
        category?: IRawCategory | IRawCategory[]
    };
    offers?: { offer?: IRawOffer | IRawOffer[] };
}

export interface IXMLDocument {
    yml_catalog?: {
        shop?: IRawShop;
    }
}