export const toArray = <T>(value: T | T[] | undefined): T[] => {
    if (value === undefined) {
        return [];
    }
     return Array.isArray(value) ? value : [value];
}

export const toTrimmedString = (value: unknown): string => {
    if (typeof value !== "string") {
        return "";
    }
    return value.trim();
}

export const toNumber = (value: unknown): number => {
    if (value === null) {
        return 0;
    }
    const parsedValue = Number(String(value).trim());
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const toBoolean = (value: unknown): boolean => {
    if (typeof value === "string") {
        return value.trim().toLowerCase() === "true";
    }
    return value === true;
}