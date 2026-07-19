import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";

const SearchIcon = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
);

const NavbarSearch = ({ variant = "home" }) => {
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

    if (variant === "store") {
        return (
            <form className="flex w-full max-w-[760px] flex-1" onSubmit={handleSubmit}>
                <input
                    className="h-10 flex-1 rounded-l-md border-0 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    type="text"
                    placeholder="Search products & brands"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <button
                    type="submit"
                    className="flex h-10 items-center gap-2 rounded-r-md bg-[#333333] px-5 text-sm font-semibold text-white transition hover:bg-black"
                >
                    <SearchIcon className="h-4 w-4 text-white" />
                    Search
                </button>
            </form>
        );
    }

    return (
        <form className="w-full max-w-[720px]" onSubmit={handleSubmit}>
            <div className="relative flex h-11 items-center gap-3 rounded-[10px] border border-[#e1e1e1] bg-[#f7f7f7] px-4">
                <SearchIcon className="h-[18px] w-[18px] text-slate-500" />
                {!query && (
                    <span className="pointer-events-none absolute left-11 text-sm text-slate-500">
                        Search for <span className="font-bold text-slate-700">Brands & Products</span>
                    </span>
                )}
                <input
                    className="relative z-[1] w-full bg-transparent text-sm text-slate-700 outline-none"
                    type="text"
                    aria-label="Search for brands and products"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>
        </form>
    );
};

export default NavbarSearch;
