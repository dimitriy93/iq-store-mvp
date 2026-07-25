interface IXmlTypeMap {
    string: string;
    boolean: boolean;
    number: number;
    undefined: undefined;
}

const getRawString = (element: Element, selector: string, isAttribute: boolean): string | null => {
    if (isAttribute) {
        return element.getAttribute(selector);
    }
    const childTag = element.getElementsByTagName(selector)[0];
    return childTag ? childTag.textContent : null;
}

export const getXmlValue = <T extends keyof IXmlTypeMap>(
    element: Element,
    selector: string,
    type: T,
    isAttribute: boolean = false
): IXmlTypeMap[T] => {
    const rawValue = getRawString(element, selector, isAttribute);

    if (rawValue === null || rawValue === undefined) {
        if (type === "number") {
            return 0 as IXmlTypeMap[T];
        }
        if (type === "boolean") {
            return false as IXmlTypeMap[T];
        }
        return "" as IXmlTypeMap[T];
    }

    const cleanValue = rawValue.trim();

    if (type === "number") {
        const parsed = Number(cleanValue);
        return (isNaN(parsed) ? 0 : parsed) as IXmlTypeMap[T];
    }

    if (type === "boolean") {
        return (cleanValue === "true") as IXmlTypeMap[T];
    }

    return cleanValue as IXmlTypeMap[T];
}