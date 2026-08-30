import type {ICategory} from "../model/category.types";

export const getCategoryChildren = (categories: ICategory[], parentId: string): ICategory[] =>
    categories.filter(category => category.parentId === parentId);

export const getCategoryDescendantIds = (categories: ICategory[], categoryId: string): Set<string> => {
    const ids = new Set<string>();
    const stack = [categoryId];

    while (stack.length > 0) {
        const currentId = stack.pop() as string;

        if (ids.has(currentId)) {
            continue;
        }

        ids.add(currentId);

        for (const category of categories) {
            if (category.parentId === currentId) {
                stack.push(category.id);
            }
        }
    }

    return ids;
};

export const getCategoryChain = (categories: ICategory[], categoryId: string): ICategory[] => {
    const categoriesById = new Map(categories.map(category => [category.id, category]));
    const chain: ICategory[] = [];
    let current = categoriesById.get(categoryId);

    while (current) {
        chain.unshift(current);
        current = current.parentId ? categoriesById.get(current.parentId) : undefined;
    }

    return chain;
};

export const findRootCategory = (categories: ICategory[]): ICategory | undefined => {
    const parentIds = new Set(
        categories
            .map(category => category.parentId)
            .filter((parentId): parentId is string => Boolean(parentId))
    );

    return categories.find(category => !category.parentId && parentIds.has(category.id));
};
