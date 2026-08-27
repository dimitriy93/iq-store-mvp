export const getProductImage = (id: string | number) => {
    const numericId = Number(String(id).replace(/\D/g, ""));

    if (!Number.isFinite(numericId)) {
        return "/catalog/product-01.webp";
    }
    const imageIndex = (numericId % 10) || 10;

    return `/catalog/product-${String(imageIndex).padStart(2, "0")}.webp`;
};