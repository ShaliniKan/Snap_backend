import MegaMenuPanel from "./MegaMenuPanel";

const MegaMenu = ({
    activeCategory,
    subcategories = [],
    loading = false,
    error = "",
    isOpen = false,
    anchorLeft = 0,
    onMouseEnter,
    onMouseLeave,
    onNavigate,
}) => {
    if (!activeCategory) {
        return null;
    }

    return (
        <div
            aria-hidden={!isOpen}
            className={`absolute top-full z-50 hidden w-max max-w-[min(980px,calc(100vw-48px))] pt-1 transition duration-200 ease-out lg:block ${
                isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ left: anchorLeft }}
        >
            <div
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                id="category-mega-menu"
                role="menu"
            >
                <MegaMenuPanel
                    activeCategory={activeCategory}
                    error={error}
                    loading={loading}
                    onNavigate={onNavigate}
                    subcategories={subcategories}
                />
            </div>
        </div>
    );
};
export default MegaMenu;
