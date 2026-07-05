import React from "react";

const ProductCard = ({ product }) => {
    const image = product.image || "/banner1.jpg";

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <img src={image} alt={product.name} className="h-44 w-full rounded-xl object-cover" />
            <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-600">{product.description || "Premium quality product ready to ship."}</p>
                <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-red-500">₹{product.price || "999"}</span>
                    <button className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Add to cart</button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
