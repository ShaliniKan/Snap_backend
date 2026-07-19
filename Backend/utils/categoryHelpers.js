const PRIORITY_CATEGORIES = ["men", "women", "kids"];
const mongoose = require("mongoose");

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

const toObjectId = (value) => {
    if (!value) {
        return null;
    }

    if (value instanceof mongoose.Types.ObjectId) {
        return value;
    }

    try {
        return new mongoose.Types.ObjectId(String(value));
    } catch (error) {
        return null;
    }
};

const matchParentCategoryId = (parentCategoryId) => {
    if (!parentCategoryId) {
        return { parentCategoryId: null };
    }

    const parentIdString = String(parentCategoryId);

    return {
        $expr: {
            $eq: [{ $toString: "$parentCategoryId" }, parentIdString],
        },
    };
};

module.exports = {
    buildCategoryResponse,
    sortRootCategories,
    matchParentCategoryId,
    toObjectId,
    PRIORITY_CATEGORIES,
};
