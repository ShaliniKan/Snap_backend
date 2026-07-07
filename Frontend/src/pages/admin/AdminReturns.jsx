import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { getAdminReturns, updateReturnStatus } from "../../services/returnService";

const AdminReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReturns = () => getAdminReturns().then(setReturns).finally(() => setLoading(false));

    useEffect(() => {
        loadReturns();
    }, []);

    const handleUpdate = async (returnId, status) => {
        await updateReturnStatus(returnId, { status });
        loadReturns();
    };

    if (loading) return <SectionState>Loading returns...</SectionState>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Return Requests</h2>
            {returns.length === 0 ? (
                <SectionState>No return requests.</SectionState>
            ) : (
                returns.map((entry) => (
                    <div key={entry._id} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="font-semibold text-slate-900">Order #{entry.order_id?._id?.slice(-8) || "N/A"}</p>
                        <p className="mt-1 text-sm text-slate-600">{entry.reason}</p>
                        <p className="mt-1 text-xs uppercase text-slate-500">{entry.status}</p>
                        <div className="mt-3 flex gap-2">
                            {["approved", "rejected", "refunded"].map((status) => (
                                <button key={status} className="rounded-sm border px-3 py-1 text-xs font-semibold capitalize" onClick={() => handleUpdate(entry._id, status)} type="button">{status}</button>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminReturns;
