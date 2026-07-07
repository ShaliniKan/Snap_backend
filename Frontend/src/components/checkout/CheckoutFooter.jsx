const CheckoutFooter = ({ currentStep, total, onBack, onContinue, isSubmitting = false, orderSuccess = false }) => {
    const actionLabel = orderSuccess
        ? "Close"
        : currentStep === 3
            ? (isSubmitting ? "Placing order..." : `PAY ₹${total}`)
            : "Continue";

    return (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">Amount Payable</p>
                    <p className="text-lg font-semibold text-slate-900">₹{total}</p>
                </div>

                <div className="flex items-center gap-3">
                    {currentStep > 1 && !orderSuccess && (
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                            Back
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onContinue}
                        disabled={isSubmitting}
                        className="rounded-sm bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutFooter;
