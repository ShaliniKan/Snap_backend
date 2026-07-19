import { useRef } from "react";

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HorizontalCarousel = ({ children, className = "" }) => {
    const trackRef = useRef(null);

    const scrollByAmount = (direction) => {
        if (!trackRef.current) {
            return;
        }

        const amount = trackRef.current.clientWidth * 0.75;
        trackRef.current.scrollBy({ left: direction * amount, behavior: "smooth" });
    };

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollByAmount(-1)}
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50"
            >
                <ChevronLeft />
            </button>

            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto scroll-smooth px-10 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>

            <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollByAmount(1)}
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50"
            >
                <ChevronRight />
            </button>
        </div>
    );
};

export default HorizontalCarousel;
