export const PRIORITY_CATEGORIES = ["men", "women", "kids"];

const normalizeName = (name = "") => String(name).trim().toLowerCase();

const getCategoryPriorityIndex = (categoryName = "") => {
    const normalized = normalizeName(categoryName);
    const index = PRIORITY_CATEGORIES.indexOf(normalized);

    return index === -1 ? PRIORITY_CATEGORIES.length : index;
};

export const sortRootCategories = (categories = []) =>
    [...categories].sort((left, right) => {
        const leftName = left.itemName || left.name || "";
        const rightName = right.itemName || right.name || "";
        const leftPriority = getCategoryPriorityIndex(leftName);
        const rightPriority = getCategoryPriorityIndex(rightName);

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        const leftHasSubs = Number(left.subcategoryCount || 0) > 0;
        const rightHasSubs = Number(right.subcategoryCount || 0) > 0;

        if (leftHasSubs !== rightHasSubs) {
            return leftHasSubs ? -1 : 1;
        }

        return leftName.localeCompare(rightName);
    });

export const getCategoryImage = (categoryName = "") => {
    const normalizedName = normalizeName(categoryName);

    if (normalizedName.includes("men")) return "/men.jpg";
    if (normalizedName.includes("women")) return "/women.jpg";
    if (normalizedName.includes("kid")) return "/banner2.jpg";
    if (normalizedName.includes("electronic")) return "/banner1.jpg";
    if (normalizedName.includes("beauty")) return "/banner2.jpg";
    if (normalizedName.includes("footwear")) return "/banner1.jpg";

    return "/banner1.jpg";
};
