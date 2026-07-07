import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getSubcategories } from "../../services/categoryService";
import MegaMenu from "./MegaMenu";
import useCategories from "../../hooks/useCategories";
import { getCategoryImage } from "../../utils/sortCategories";

const CategoryBar = ({ className = "" }) => {
    const { categories, loading, error } = useCategories();
    const [activeCategory, setActiveCategory] = useState(null);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
    const [loadingCategoryId, setLoadingCategoryId] = useState("");
    const [subcategoryError, setSubcategoryError] = useState("");
    const closeTimerRef = useRef(null);

    const containerClassName = `flex items-center gap-4 overflow-x-auto bg-white px-4 py-3 text-sm font-medium sm:px-6 lg:px-12 ${className}`;
    const activeCategoryId = activeCategory?._id;
    const activeSubcategories = activeCategoryId ? subcategoriesByCategory[activeCategoryId] || [] : [];

    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const closeMegaMenu = useCallback(() => {
        clearCloseTimer();
        setIsMegaMenuOpen(false);
        setSubcategoryError("");
    }, [clearCloseTimer]);

    const scheduleCloseMegaMenu = useCallback(() => {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => {
            setIsMegaMenuOpen(false);
            setSubcategoryError("");
        }, 180);
    }, [clearCloseTimer]);

    const loadSubcategories = useCallback(async (categoryId) => {
        if (subcategoriesByCategory[categoryId]) {
            return;
        }

        try {
            setLoadingCategoryId(categoryId);
            setSubcategoryError("");
            const data = await getSubcategories(categoryId);
            setSubcategoriesByCategory((current) => ({
                ...current,
                [categoryId]: data,
            }));
        } catch (err) {
            setSubcategoryError("Subcategories unavailable");
        } finally {
            setLoadingCategoryId("");
        }
    }, [subcategoriesByCategory]);

    const openMegaMenu = useCallback((category) => {
        clearCloseTimer();
        setActiveCategory(category);
        setIsMegaMenuOpen(true);
        loadSubcategories(category._id);
    }, [clearCloseTimer, loadSubcategories]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMegaMenu();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearCloseTimer();
        };
    }, [clearCloseTimer, closeMegaMenu]);

    if (loading) {
        return (
            <div className={`bg-white px-4 py-3 text-sm font-medium text-slate-500 sm:px-6 lg:px-12 ${className}`}>
                Loading categories...
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-white px-4 py-3 text-sm font-medium text-red-500 sm:px-6 lg:px-12 ${className}`}>
                Categories unavailable
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className={`bg-white px-4 py-3 text-sm font-medium text-slate-500 sm:px-6 lg:px-12 ${className}`}>
                No categories available
            </div>
        );
    }

    return (
        <div className="relative" onMouseLeave={scheduleCloseMegaMenu}>
            <div className={containerClassName} onMouseEnter={clearCloseTimer}>
                {categories.map((category) => {
                    const isActive = activeCategoryId === category._id && isMegaMenuOpen;

                    return (
                        <Link
                            aria-controls="category-mega-menu"
                            aria-expanded={isActive}
                            aria-haspopup="menu"
                            key={category._id}
                            onFocus={() => openMegaMenu(category)}
                            onMouseEnter={() => openMegaMenu(category)}
                            to={`/categories/${category._id}`}
                            className={`flex shrink-0 items-center gap-2 rounded-sm px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-red-100 ${
                                isActive ? "bg-red-50 text-red-500" : "hover:bg-slate-50 hover:text-red-500"
                            }`}
                        >
                            <img
                                src={getCategoryImage(category.itemName)}
                                alt=""
                                className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                            />
                            {category.itemName}
                        </Link>
                    );
                })}
            </div>

            <MegaMenu
                activeCategory={activeCategory}
                error={subcategoryError}
                isOpen={isMegaMenuOpen}
                loading={loadingCategoryId === activeCategoryId}
                onMouseEnter={clearCloseTimer}
                onMouseLeave={scheduleCloseMegaMenu}
                subcategories={activeSubcategories}
            />
        </div>
    );
};

export default CategoryBar;
