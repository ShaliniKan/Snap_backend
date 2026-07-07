const PRIORITY_CATEGORIES = ["men", "women", "kids"];

const normalizeName = (name = "") => String(name).trim().toLowerCase();

const getCategoryPriorityIndex = (categoryName = "") => {
    const normalized = normalizeName(categoryName);
    const index = PRIORITY_CATEGORIES.indexOf(normalized);

    return index === -1 ? PRIORITY_CATEGORIES.length : index;
};

const sortRootCategories = (categories = [], subcategoryCountMap = {}) => {
    return [...categories].sort((left, right) => {
        const leftName = left.itemName || left.name || "";
        const rightName = right.itemName || right.name || "";
        const leftPriority = getCategoryPriorityIndex(leftName);
        const rightPriority = getCategoryPriorityIndex(rightName);

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        const leftHasSubs = Number(subcategoryCountMap[left._id?.toString?.() || left._id] || left.subcategoryCount || 0) > 0;
        const rightHasSubs = Number(subcategoryCountMap[right._id?.toString?.() || right._id] || right.subcategoryCount || 0) > 0;

        if (leftHasSubs !== rightHasSubs) {
            return leftHasSubs ? -1 : 1;
        }

        return leftName.localeCompare(rightName);
    });
};

const buildCategoryResponse = (category, children = []) => {
    if (!category) {
        return null;
    }

    return {
        ...category,
        children: Array.isArray(children) ? children : [],
    };
};

module.exports = {
    buildCategoryResponse,
    sortRootCategories,
    PRIORITY_CATEGORIES,
};
