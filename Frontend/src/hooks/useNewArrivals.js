import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

const useNewArrivals = (limit = 10) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadNewArrivals = async () => {
            try {
                const data = await getProducts(`sort=newest&limit=${limit}`);
                setProducts((data.products || []).slice(0, limit));
            } catch (err) {
                setError("We could not load new arrivals right now.");
            } finally {
                setLoading(false);
            }
        };

        loadNewArrivals();
    }, [limit]);

    return { products, loading, error };
};

export default useNewArrivals;
