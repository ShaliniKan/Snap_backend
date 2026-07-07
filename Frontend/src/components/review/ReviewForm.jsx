import { useState } from "react";

const ReviewForm = ({ onSubmit, isSubmitting = false }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ rating: Number(rating), comment });
    };

    return (
        <form className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
            <h3 className="text-sm font-semibold text-slate-900">Write a review</h3>
            <label className="mt-3 block text-sm">
                <span className="font-semibold text-slate-700">Rating</span>
                <select
                    className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                >
                    {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} Star{value > 1 ? "s" : ""}</option>
                    ))}
                </select>
            </label>
            <label className="mt-3 block text-sm">
                <span className="font-semibold text-slate-700">Comment</span>
                <textarea
                    className="mt-1 min-h-24 w-full rounded-sm border border-slate-200 px-3 py-2"
                    placeholder="Share your experience with this product"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
            </label>
            <button
                className="mt-4 rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
};

export default ReviewForm;
