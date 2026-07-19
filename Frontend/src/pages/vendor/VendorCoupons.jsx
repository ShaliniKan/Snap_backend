import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { createCoupon, getCoupons } from "../../services/couponService";

const VendorCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState({ code: "", description: "", discountType: "percent", discountValue: 10, minOrderAmount: 499 });
    const [loading, setLoading] = useState(true);

    const loadCoupons = () => getCoupons().then(setCoupons).finally(() => setLoading(false));

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleCreate = async (event) => {
        event.preventDefault();
        await createCoupon(form);
        setForm({ code: "", description: "", discountType: "percent", discountValue: 10, minOrderAmount: 499 });
        loadCoupons();
    };

    if (loading) return <SectionState>Loading coupons...</SectionState>;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Platform</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Coupons</h2>
            </div>
            <form className="grid gap-3 rounded-sm border border-slate-200 bg-white p-4 md:grid-cols-3" onSubmit={handleCreate}>
                <input className="h-10 rounded-sm border px-3 text-sm" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                <input className="h-10 rounded-sm border px-3 text-sm md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <select className="h-10 rounded-sm border px-3 text-sm" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                    <option value="percent">Percent</option>
                    <option value="flat">Flat</option>
                </select>
                <input className="h-10 rounded-sm border px-3 text-sm" type="number" placeholder="Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
                <input className="h-10 rounded-sm border px-3 text-sm" type="number" placeholder="Min order" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
                <button className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white md:col-span-3 md:w-fit" type="submit">Create Coupon</button>
            </form>
            <div className="space-y-2">
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm">
                        <strong>{coupon.code}</strong> · {coupon.description} · {coupon.discountType === "flat" ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorCoupons;
