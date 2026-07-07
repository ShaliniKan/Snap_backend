import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

const useProducts = () => {    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data.products || []);
            } catch (err) {
                setError("We could not load products right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return { products, loading, error };
};

export default useProducts;
