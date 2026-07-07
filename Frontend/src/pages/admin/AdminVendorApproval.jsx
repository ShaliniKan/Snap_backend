import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { approveVendor, getPendingVendors, rejectVendor } from "../../services/vendorService";

const AdminVendorApproval = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState("");

    const loadVendors = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getPendingVendors();
            setVendors(data);
        } catch (err) {
            setError(err.response?.data?.message || "Could not load pending vendors.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const handleApprove = async (vendorUserId) => {
        try {
            setActionId(vendorUserId);
            await approveVendor(vendorUserId);
            await loadVendors();
        } catch (err) {
            setError(err.response?.data?.message || "Could not approve vendor.");
        } finally {
            setActionId("");
        }
    };

    const handleReject = async (vendorUserId) => {
        try {
            setActionId(vendorUserId);
            await rejectVendor(vendorUserId);
            await loadVendors();
        } catch (err) {
            setError(err.response?.data?.message || "Could not reject vendor.");
        } finally {
            setActionId("");
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Admin Panel</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900">Vendor Approvals</h1>
            </div>

            {loading ? (
                <SectionState>Loading pending vendors...</SectionState>
            ) : error ? (
                <SectionState variant="error">{error}</SectionState>
            ) : vendors.length === 0 ? (
                <SectionState>No pending vendor applications.</SectionState>
            ) : (
                <div className="space-y-4">
                    {vendors.map((vendor) => {
                        const userId = vendor.userId?._id || vendor.userId;
                        const isBusy = actionId === userId;

                        return (
                            <div key={vendor._id} className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{vendor.businessName}</h2>
                                        <p className="mt-1 text-sm text-slate-600">{vendor.businessAddress}</p>
                                        <p className="mt-2 text-sm text-slate-500">
                                            {vendor.userId?.firstName} {vendor.userId?.lastName} · {vendor.userId?.email}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">Contact: {vendor.contactNumber}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="rounded-sm bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                                            disabled={isBusy}
                                            onClick={() => handleApprove(userId)}
                                            type="button"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="rounded-sm border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                                            disabled={isBusy}
                                            onClick={() => handleReject(userId)}
                                            type="button"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminVendorApproval;
