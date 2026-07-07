const ReviewList = ({ reviews = [] }) => {
    if (reviews.length === 0) {
        return <p className="text-sm text-slate-500">No reviews yet. Be the first to review this product.</p>;
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <article key={review._id} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{review.customer_name || "Customer"}</p>
                            <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <span className="rounded-sm bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                            {review.rating} ★
                        </span>
                    </div>
                    {review.comment && <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>}
                </article>
            ))}
        </div>
    );
};

export default ReviewList;
