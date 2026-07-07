import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";

const NavbarSearch = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const currentSearch = params.get("search");

        if (currentSearch) {
            setQuery(currentSearch);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return;
        }

        navigate(`${ROUTES.public.products}?search=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <form className="flex flex-1" onSubmit={handleSubmit}>
            <input
                className="h-11 w-full rounded-l-sm border border-r-0 border-slate-200 bg-white px-4 text-sm outline-none focus:border-red-400"
                type="text"
                placeholder="Search for Brands & Products"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <button
                className="h-11 shrink-0 rounded-r-sm bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
                type="submit"
            >
                Search
            </button>
        </form>
    );
};

export default NavbarSearch;
