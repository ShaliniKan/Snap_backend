import { useRef, useState } from "react";

const ImageZoom = ({ src, alt, className = "" }) => {
    const containerRef = useRef(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });

    const handleMove = (event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setOrigin({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-slate-50 ${className}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMove}
        >
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition-transform duration-200 ease-out"
                style={{
                    transform: isZoomed ? "scale(2)" : "scale(1)",
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
            />
        </div>
    );
};

export default ImageZoom;
