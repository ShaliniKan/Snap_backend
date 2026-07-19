import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useCategories from "../../../hooks/useCategories";
import { getSubcategories } from "../../../services/categoryService";
import { getCategoryImage } from "../../../utils/sortCategories";
import Backdrop from "../../cart/Backdrop";
import MegaMenuPanel from "../MegaMenuPanel";

const TOP_CATEGORY_COUNT = 5;
const DRAWER_LEFT_OFFSET = 30;
const SUBMENU_RIGHT_GAP = 100;
const DRAWER_WIDTH = "min(200px, 85vw)";

const getHeaderBottom = () => {
    const navbar = document.querySelector("[data-store-navbar]");
    if (navbar) {
        return navbar.getBoundingClientRect().bottom;
    }

    return 0;
};

const CategoryRow = ({ category, isActive, onActivate, onClose, showImage = true, compact = false, stretch = false }) => (
    <Link
        aria-expanded={isActive}
        className={`flex items-center font-normal transition ${
            stretch ? "min-h-0 flex-1" : ""
        } ${
            compact
                ? showImage
                    ? `gap-2 px-3 text-[13px] leading-5${stretch ? "" : " py-1.5"}`
                    : `px-3 text-[13px] leading-5${stretch ? "" : " py-1"}`
                : "gap-3 px-5 py-3 text-[14px]"
        } ${
            isActive ? "bg-category-active text-brand-primary" : "text-snap-primary hover:bg-category-active hover:text-brand-primary"
        }`}
        onClick={onClose}
        onFocus={() => onActivate(category)}
        onMouseEnter={() => onActivate(category)}
        to={`/categories/${category._id}`}
    >
        {showImage && (
            <img
                alt=""
                className={`shrink-0 rounded-full object-cover ${
                    compact ? "h-6 w-6" : "h-9 w-9"
                } ${isActive ? "border-2 border-brand-primary" : "border border-snapborder"}`}
                src={getCategoryImage(category.itemName)}
            />
        )}
        <span className="truncate">{category.itemName}</span>
    </Link>
);

const StoreCategoryDrawer = ({ isOpen, onClose }) => {
    const { categories, loading, error } = useCategories();
    const [panelTop, setPanelTop] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
    const [loadingCategoryId, setLoadingCategoryId] = useState("");
    const [subcategoryError, setSubcategoryError] = useState("");
    const closeTimerRef = useRef(null);

    const topCategories = categories.slice(0, TOP_CATEGORY_COUNT);
    const moreCategories = categories.slice(TOP_CATEGORY_COUNT);
    const activeCategoryId = activeCategory?._id;
    const activeSubcategories = activeCategoryId ? subcategoriesByCategory[activeCategoryId] || [] : [];

    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const scheduleCloseSubmenu = useCallback(() => {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => {
            setIsSubmenuOpen(false);
            setSubcategoryError("");
        }, 180);
    }, [clearCloseTimer]);

    const loadSubcategories = useCallback(
        async (categoryId) => {
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
        },
        [subcategoriesByCategory]
    );

    const openSubmenu = useCallback(
        (category) => {
            clearCloseTimer();
            setActiveCategory(category);
            setIsSubmenuOpen(true);
            loadSubcategories(category._id);
        },
        [clearCloseTimer, loadSubcategories]
    );

    useLayoutEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const updatePanelTop = () => {
            setPanelTop(getHeaderBottom());
        };

        updatePanelTop();
        window.addEventListener("resize", updatePanelTop);
        window.addEventListener("scroll", updatePanelTop, true);

        return () => {
            window.removeEventListener("resize", updatePanelTop);
            window.removeEventListener("scroll", updatePanelTop, true);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setActiveCategory(null);
            setIsSubmenuOpen(false);
            setSubcategoryError("");
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
            clearCloseTimer();
        };
    }, [clearCloseTimer, isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <Backdrop onClick={onClose} top={panelTop} />
            <div
                className="fixed z-[60]"
                onMouseLeave={scheduleCloseSubmenu}
                style={{
                    top: panelTop,
                    left: DRAWER_LEFT_OFFSET,
                    height: `calc(100vh - ${panelTop}px)`,
                    width: DRAWER_WIDTH,
                }}
            >
                <aside
                    aria-label="All categories"
                    className="flex h-full w-full flex-col bg-white shadow-xl"
                    onMouseEnter={clearCloseTimer}
                >
                    <nav className="flex h-full flex-col overflow-hidden py-2">
                        {loading && <p className="px-3 py-2 text-[11px] text-[#666666]">Loading categories...</p>}
                        {error && <p className="px-3 py-2 text-[11px] text-brand-primary">{error}</p>}

                        {!loading && !error && (
                            <>
                                <div className="flex min-h-0 flex-1 flex-col">
                                    <p className="shrink-0 px-3 pb-1 text-[10px] font-normal uppercase tracking-wide text-[#999999]">
                                        Top Categories
                                    </p>
                                    <div className="flex min-h-0 flex-1 flex-col">
                                        {topCategories.map((category) => (
                                            <CategoryRow
                                                key={category._id}
                                                category={category}
                                                compact
                                                isActive={activeCategoryId === category._id && isSubmenuOpen}
                                                onActivate={openSubmenu}
                                                onClose={onClose}
                                                showImage
                                                stretch
                                            />
                                        ))}
                                    </div>
                                </div>

                                {moreCategories.length > 0 && (
                                    <div className="flex min-h-0 flex-1 flex-col">
                                        <p className="shrink-0 px-3 pb-1 text-[10px] font-normal uppercase tracking-wide text-[#999999]">
                                            More Categories
                                        </p>
                                        <div className="flex min-h-0 flex-1 flex-col">
                                            {moreCategories.map((category) => (
                                                <CategoryRow
                                                    key={category._id}
                                                    category={category}
                                                    compact
                                                    isActive={activeCategoryId === category._id && isSubmenuOpen}
                                                    onActivate={openSubmenu}
                                                    onClose={onClose}
                                                    showImage={false}
                                                    stretch
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </nav>
                </aside>

                {activeCategory && isSubmenuOpen && (
                    <div
                        className="absolute left-full top-0 z-[61] hidden border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:block"
                        onMouseEnter={clearCloseTimer}
                        onMouseLeave={scheduleCloseSubmenu}
                        role="menu"
                        style={{
                            width: "max-content",
                            maxWidth: `min(980px, calc(100vw - ${DRAWER_LEFT_OFFSET}px - ${DRAWER_WIDTH} - ${SUBMENU_RIGHT_GAP}px))`,
                            maxHeight: `min(520px, calc(100vh - ${panelTop}px - 24px))`,
                        }}
                    >
                        <MegaMenuPanel
                            activeCategory={activeCategory}
                            error={subcategoryError}
                            loading={loadingCategoryId === activeCategoryId}
                            onNavigate={onClose}
                            subcategories={activeSubcategories}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default StoreCategoryDrawer;
