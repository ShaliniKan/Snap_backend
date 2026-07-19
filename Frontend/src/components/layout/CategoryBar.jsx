import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
    const [menuLeft, setMenuLeft] = useState(0);
    const closeTimerRef = useRef(null);
    const wrapperRef = useRef(null);
    const categoryRefs = useRef({});

    const containerClassName = `flex items-center gap-4 overflow-x-auto bg-white px-3 py-3 text-sm font-medium [scrollbar-width:none] sm:px-4 lg:px-6 [&::-webkit-scrollbar]:hidden ${className}`;
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
        if (Array.isArray(subcategoriesByCategory[categoryId]) && subcategoriesByCategory[categoryId].length > 0) {
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

    const updateMenuPosition = useCallback((categoryId) => {
        const categoryEl = categoryRefs.current[categoryId];
        const wrapperEl = wrapperRef.current;

        if (!categoryEl || !wrapperEl) {
            return;
        }

        const categoryRect = categoryEl.getBoundingClientRect();
        const wrapperRect = wrapperEl.getBoundingClientRect();
        setMenuLeft(categoryRect.left - wrapperRect.left);
    }, []);

    const openMegaMenu = useCallback(
        (category) => {
            clearCloseTimer();
            setActiveCategory(category);
            setIsMegaMenuOpen(true);
            loadSubcategories(category._id);
            updateMenuPosition(category._id);
        },
        [clearCloseTimer, loadSubcategories, updateMenuPosition]
    );

    useLayoutEffect(() => {
        if (!isMegaMenuOpen || !activeCategoryId) {
            return undefined;
        }

        const handleReposition = () => updateMenuPosition(activeCategoryId);

        handleReposition();
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [activeCategoryId, isMegaMenuOpen, updateMenuPosition]);

    useEffect(() => {        const handleKeyDown = (event) => {
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
            <div className={`bg-white px-3 py-3 text-sm font-medium text-slate-500 sm:px-4 lg:px-6 ${className}`}>
                Loading categories...
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-white px-3 py-3 text-sm font-medium text-red-500 sm:px-4 lg:px-6 ${className}`}>
                Categories unavailable
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className={`bg-white px-3 py-3 text-sm font-medium text-slate-500 sm:px-4 lg:px-6 ${className}`}>
                No categories available
            </div>
        );
    }

    return (
        <div className="relative" onMouseLeave={scheduleCloseMegaMenu} ref={wrapperRef}>
            <div className={containerClassName} onMouseEnter={clearCloseTimer}>
                {categories.map((category) => {
                    const isActive = activeCategoryId === category._id && isMegaMenuOpen;

                    return (
                        <div
                            key={category._id}
                            ref={(element) => {
                                categoryRefs.current[category._id] = element;
                            }}
                            className={`flex shrink-0 items-center gap-2 px-3 py-2 transition ${
                                isActive ? "text-brand-accent" : "text-slate-900 hover:text-brand-accent"
                            }`}
                            onMouseEnter={() => openMegaMenu(category)}
                        >                            <img
                                src={getCategoryImage(category.itemName)}
                                alt=""
                                className={`h-9 w-9 rounded-full object-cover ${
                                    isActive ? "border-2 border-brand-accent" : "border border-gray-200"
                                }`}
                            />
                            <span className="text-[16px] font-extrabold leading-6">{category.itemName}</span>
                        </div>
                    );
                })}
            </div>

            <MegaMenu
                activeCategory={activeCategory}
                anchorLeft={menuLeft}
                error={subcategoryError}
                isOpen={isMegaMenuOpen}
                loading={loadingCategoryId === activeCategoryId}
                onMouseEnter={clearCloseTimer}
                onMouseLeave={scheduleCloseMegaMenu}
                onNavigate={closeMegaMenu}
                subcategories={activeSubcategories}
            />
        </div>
    );
};
export default CategoryBar;
