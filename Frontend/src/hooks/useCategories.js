import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { sortRootCategories } from "../utils/sortCategories";

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(sortRootCategories(data));
            } catch (err) {
                setError("We could not load categories right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading, error };
};

export default useCategories;
