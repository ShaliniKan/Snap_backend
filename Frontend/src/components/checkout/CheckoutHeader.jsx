const CheckoutHeader = ({ activeStep, steps, onClose }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg font-semibold text-white">S</div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">Checkout</p>
                    <h2 className="text-lg font-semibold text-slate-900">Snapdeal-style Checkout</h2>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 text-sm font-medium text-slate-500">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = activeStep === stepNumber;
                    const isComplete = activeStep > stepNumber;
                    return (
                        <div key={step} className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 ${isActive ? "bg-red-500 text-white" : isComplete ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
                                {stepNumber}
                            </span>
                            <span className={isActive ? "text-red-500" : "text-slate-500"}>{step}</span>
                            {index < steps.length - 1 && <span className="text-slate-300">&gt;&gt;</span>}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                <select className="rounded-sm border border-slate-200 px-2 py-2 text-sm text-slate-600 outline-none">
                    <option>English</option>
                    <option>Hindi</option>
                </select>
                <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">✕</button>
            </div>
        </div>
    );
};

export default CheckoutHeader;