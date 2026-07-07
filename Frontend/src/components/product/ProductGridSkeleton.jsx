const ProductGridSkeleton = ({ count = 10 }) => {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-sm border border-slate-200 bg-white p-3">
                    <div className="aspect-square rounded-sm bg-slate-200" />
                    <div className="mt-3 h-3 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-slate-200" />
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-4 w-16 rounded bg-slate-200" />
                        <div className="h-3 w-10 rounded bg-slate-200" />
                    </div>
                    <div className="mt-4 h-9 rounded bg-slate-200" />
                </div>
            ))}
        </div>
    );
};

export default ProductGridSkeleton;
