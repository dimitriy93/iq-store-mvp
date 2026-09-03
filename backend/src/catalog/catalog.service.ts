import { readFile } from "node:fs/promises";
import { parseCatalogXml } from "./catalog.parser.js";
import type { ICatalogData } from "./catalog.types.js";

export const loadCatalog = async (xmlPath: string): Promise<ICatalogData> => {
    const xmlText = await readFile(xmlPath, "utf-8");
    return parseCatalogXml(xmlText);
};
