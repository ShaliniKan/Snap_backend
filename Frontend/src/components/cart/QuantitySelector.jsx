const QuantitySelector = ({ value, disabled = false, onChange }) => {
    return (
        <select
            aria-label="Select quantity"
            className="h-9 rounded-sm border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100 disabled:text-slate-400"
            disabled={disabled}
            onChange={(event) => onChange(Number(event.target.value))}
            value={value}
        >
            {Array.from({ length: 10 }, (_, index) => index + 1).map((quantity) => (
                <option key={quantity} value={quantity}>
                    {quantity}
                </option>
            ))}
        </select>
    );
};

export default QuantitySelector;
