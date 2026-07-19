const normalize = (value = "") => String(value).trim().toLowerCase();

const matchSubcategories = (subcategories, names = []) => {
    const lookup = new Set(names.map(normalize));

    return subcategories.filter((entry) => lookup.has(normalize(entry.itemName)));
};

const buildSection = (title, subcategories, names = []) => {
    const items = names.length > 0 ? matchSubcategories(subcategories, names) : [...subcategories];

    if (items.length === 0) {
        return null;
    }

    return { title, items };
};

const buildColumn = (...sections) => ({
    sections: sections.filter(Boolean),
});

const distributeEvenly = (subcategories, columnCount = 3) => {
    const count = Math.min(columnCount, subcategories.length);
    const columns = Array.from({ length: count }, () => []);

    subcategories.forEach((subcategory, index) => {
        columns[index % count].push(subcategory);
    });

    const sectionTitles = ["Popular Categories", "Top Picks", "More Choices"];

    return columns
        .filter((column) => column.length > 0)
        .map((column, index) =>
            buildColumn(buildSection(sectionTitles[index] || "Shop More", column))
        );
};

const CATEGORY_LAYOUTS = {
    men: (subcategories) => [
        buildColumn(buildSection("Clothing", subcategories, ["Formal Wear", "Casual Wear", "Ethnic Wear"])),
        buildColumn(buildSection("Sportswear", subcategories, ["Sports Wear"])),
    ],
    women: (subcategories) => [
        buildColumn(buildSection("Clothing", subcategories, ["Western Wear", "Ethnic Wear"])),
        buildColumn(buildSection("Footwear", subcategories, ["Footwear"])),
        buildColumn(buildSection("Accessories", subcategories, ["Accessories"])),
    ],
    footwear: (subcategories) => [
        buildColumn(buildSection("Men's Footwear", subcategories, ["Men's Footwear", "Mens Footwear"])),
        buildColumn(buildSection("Women's Footwear", subcategories, ["Women's Footwear", "Womens Footwear"])),
    ],
    "home & kitchen": (subcategories) => [
        buildColumn(
            buildSection("Cookware", subcategories, ["Cookware"]),
            buildSection("Appliances", subcategories, ["Appliances"])
        ),
        buildColumn(buildSection("Furniture", subcategories, ["Furniture"])),
        buildColumn(buildSection("Home Decor", subcategories, ["Decor"])),
    ],
    watches: (subcategories) => [buildColumn(buildSection("Watches", subcategories))],
    electronics: (subcategories) => [
        buildColumn(
            buildSection("Mobiles", subcategories, ["Mobiles"]),
            buildSection("Laptops", subcategories, ["Laptops"])
        ),
        buildColumn(buildSection("Audio", subcategories, ["Audio"])),
        buildColumn(buildSection("Cameras", subcategories, ["Cameras"])),
    ],
    "mobiles accessories": (subcategories) => [buildColumn(buildSection("Mobile Accessories", subcategories))],
    "home furnishing": (subcategories) => [
        buildColumn(buildSection("Living Room", subcategories, ["Living Room Furniture"])),
        buildColumn(buildSection("Bedroom", subcategories, ["Bedroom Furniture"])),
    ],
    "beauty & personal care": (subcategories) => [buildColumn(buildSection("Beauty & Personal Care", subcategories))],
    kids: (subcategories) => [
        buildColumn(
            buildSection("Boys Clothing", subcategories, ["Boys Clothing"]),
            buildSection("School Supplies", subcategories, ["School Supplies"])
        ),
        buildColumn(buildSection("Girls Clothing", subcategories, ["Girls Clothing"])),
        buildColumn(buildSection("Toys", subcategories, ["Toys"])),
    ],
};

const resolveLayoutKey = (categoryName = "") => {
    const normalized = normalize(categoryName);

    if (normalized === "men" || normalized.startsWith("men ")) return "men";
    if (normalized.includes("women")) return "women";
    if (normalized.includes("footwear")) return "footwear";
    if (normalized.includes("home & kitchen")) return "home & kitchen";
    if (normalized.includes("home furnishing")) return "home furnishing";
    if (normalized.includes("watch")) return "watches";
    if (normalized.includes("electronic")) return "electronics";
    if (normalized.includes("mobile")) return "mobiles accessories";
    if (normalized.includes("beauty")) return "beauty & personal care";
    if (normalized.includes("kid")) return "kids";

    return null;
};

const dedupeColumns = (columns) => {
    const usedIds = new Set();

    return columns
        .map((column) => ({
            sections: column.sections
                .map((section) => ({
                    ...section,
                    items: section.items.filter((item) => {
                        if (usedIds.has(item._id)) {
                            return false;
                        }

                        usedIds.add(item._id);
                        return true;
                    }),
                }))
                .filter((section) => section.items.length > 0),
        }))
        .filter((column) => column.sections.length > 0);
};

export const getMegaMenuColumns = (categoryName = "", subcategories = []) => {
    if (!subcategories.length) {
        return [];
    }

    const layoutKey = resolveLayoutKey(categoryName);
    const layoutBuilder = layoutKey ? CATEGORY_LAYOUTS[layoutKey] : null;

    if (layoutBuilder) {
        const columns = dedupeColumns(layoutBuilder(subcategories));
        const usedCount = columns.reduce(
            (total, column) => total + column.sections.reduce((sum, section) => sum + section.items.length, 0),
            0
        );
        const remaining = subcategories.filter(
            (item) => !columns.some((column) =>
                column.sections.some((section) => section.items.some((entry) => entry._id === item._id))
            )
        );

        if (columns.length > 0) {
            if (remaining.length > 0) {
                const extra = distributeEvenly(remaining, Math.min(3, remaining.length));
                return dedupeColumns([...columns, ...extra]).slice(0, 3);
            }

            return columns.slice(0, 3);
        }
    }

    return distributeEvenly(subcategories, Math.min(3, subcategories.length));
};

