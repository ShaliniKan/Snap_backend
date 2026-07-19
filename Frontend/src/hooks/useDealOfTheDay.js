import { useEffect, useState } from "react";
import { getCategories, getSubcategories } from "../services/categoryService";

const useDealOfTheDay = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDeals = async () => {
            try {
                const categories = await getCategories();
                const categoriesWithSubs = categories.filter((category) => Number(category.subcategoryCount || 0) > 0);

                const subcategoryGroups = await Promise.all(
                    categoriesWithSubs.map(async (category) => {
                        const subcategories = await getSubcategories(category._id);
                        return subcategories.map((subcategory) => ({
                            ...subcategory,
                            parentName: category.itemName,
                            parentCategoryId: category._id,
                        }));
                    })
                );

                setDeals(subcategoryGroups.flat().slice(0, 12));
            } catch (err) {
                setError("We could not load deals right now.");
            } finally {
                setLoading(false);
            }
        };

        loadDeals();
    }, []);

    return { deals, loading, error };
};

export default useDealOfTheDay;
