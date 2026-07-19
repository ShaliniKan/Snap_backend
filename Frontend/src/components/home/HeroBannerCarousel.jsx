import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BANNER_SLIDES } from "../../utils/homeContent";

const HeroBannerCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % BANNER_SLIDES.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <section className="w-full bg-white">
            <div className="relative mx-auto max-w-page px-4 sm:px-6 lg:px-12">
                <div className="relative aspect-[16/5] min-h-[140px] w-full overflow-hidden rounded-sm sm:min-h-[180px] md:min-h-[220px]">
                    {BANNER_SLIDES.map((slide, index) => (
                        <Link
                            key={slide.id}
                            to={slide.href}
                            className={`absolute inset-0 transition-opacity duration-700 ${
                                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
                            }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="h-full w-full object-cover"
                            />
                        </Link>
                    ))}

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                        {BANNER_SLIDES.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => setActiveIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === activeIndex ? "w-6 bg-red-500" : "w-2 bg-white/80"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBannerCarousel;
