const MobileMenuButton = ({ isOpen, onClick, variant = "home" }) => {
    if (variant === "store") {
        return (
            <button
                aria-expanded={isOpen}
                aria-label="Browse categories"
                className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
                onClick={onClick}
                type="button"
            >
                <span className="h-0.5 w-6 bg-white" />
                <span className="h-0.5 w-6 bg-white" />
                <span className="h-0.5 w-6 bg-white" />
            </button>
        );
    }

    const barColor = "bg-slate-700";
    const borderClass = "border-slate-200";

    return (
        <button
            aria-expanded={isOpen}
            aria-label="Toggle menu"
            className={`flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-sm border ${borderClass}`}
            onClick={onClick}
            type="button"
        >
            <span className={`h-0.5 w-5 ${barColor}`} />
            <span className={`h-0.5 w-5 ${barColor}`} />
            <span className={`h-0.5 w-5 ${barColor}`} />
        </button>
    );
};

export default MobileMenuButton;
