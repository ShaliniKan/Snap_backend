const PaymentOption = ({ label, description, selected, onSelect }) => {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition ${selected ? "border-red-500 bg-red-50" : "border-slate-200 bg-white hover:border-red-200"}`}
        >
            <div>
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <span className={`h-4 w-4 rounded-full border ${selected ? "border-red-500 bg-red-500" : "border-slate-300"}`} />
        </button>
    );
};

export default PaymentOption;