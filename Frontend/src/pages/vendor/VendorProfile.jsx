import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { createVendorProfile, getVendorProfile, updateVendorProfile } from "../../services/vendorService";

const emptyForm = {
    businessName: "",
    businessAddress: "",
    contactNumber: "",
};

const VendorProfile = () => {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getVendorProfile();
                setForm({
                    businessName: data.businessName || "",
                    businessAddress: data.businessAddress || "",
                    contactNumber: data.contactNumber || "",
                });
                setHasProfile(true);
            } catch (err) {
                if (err.response?.data?.code !== "VENDOR_PROFILE_MISSING") {
                    setError(err.response?.data?.message || "Could not load seller profile.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            if (hasProfile) {
                await updateVendorProfile(form);
                setSuccessMessage("Seller profile updated.");
            } else {
                await createVendorProfile(form);
                setHasProfile(true);
                setSuccessMessage("Seller profile created.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Could not save seller profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <SectionState>Loading seller profile...</SectionState>;
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Seller Account</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Business Profile</h2>
            </div>

            {error && <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            {successMessage && <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

            <form className="space-y-4 rounded-sm border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
                <label className="block text-sm">
                    <span className="font-semibold text-slate-700">Business name</span>
                    <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
                </label>
                <label className="block text-sm">
                    <span className="font-semibold text-slate-700">Business address</span>
                    <textarea className="mt-1 min-h-24 w-full rounded-sm border border-slate-200 px-3 py-2" value={form.businessAddress} onChange={(e) => setForm({ ...form, businessAddress: e.target.value })} required />
                </label>
                <label className="block text-sm">
                    <span className="font-semibold text-slate-700">Contact number</span>
                    <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="10-digit mobile number" required />
                </label>
                <button className="rounded-sm bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60" disabled={saving} type="submit">
                    {saving ? "Saving..." : hasProfile ? "Update Profile" : "Create Profile"}
                </button>
            </form>
        </div>
    );
};

export default VendorProfile;
