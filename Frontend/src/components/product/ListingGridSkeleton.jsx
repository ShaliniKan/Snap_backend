const ListingGridSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="animate-pulse bg-white">
                    <div className="aspect-[3/4] bg-slate-200" />
                    <div className="px-1 py-3">
                        <div className="h-3 rounded bg-slate-200" />
                        <div className="mt-2 h-3 w-3/4 rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-20 rounded bg-slate-200" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingGridSkeleton;
