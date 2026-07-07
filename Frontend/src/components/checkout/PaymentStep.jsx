const paymentOptions = [
    { id: "upi", label: "UPI", description: "Pay using BHIM, Google Pay, PhonePe" },
    { id: "card", label: "Credit Card", description: "Visa, Mastercard, RuPay" },
    { id: "debit", label: "Debit Card", description: "Use your debit card" },
    { id: "netbanking", label: "Net Banking", description: "Bank transfer via online banking" },
    { id: "wallet", label: "Wallet", description: "Paytm, Freecharge, Mobikwik" },
    { id: "cod", label: "Cash On Delivery", description: "Pay when delivered" },
];

const PaymentStep = ({ selectedPayment, onSelectPayment }) => {
    return (
        <div className="space-y-5">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Payments</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Choose a payment method</h3>
            </div>

            <div className="grid gap-3">
                {paymentOptions.map((option) => {
                    const isSelected = selectedPayment === option.id;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onSelectPayment(option.id)}
                            className={`rounded-xl border px-4 py-4 text-left transition ${isSelected ? "border-red-500 bg-red-50 shadow-sm" : "border-slate-200 bg-white hover:border-red-200"}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-900">{option.label}</p>
                                    <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                                </div>
                                <span className={`h-4 w-4 rounded-full border ${isSelected ? "border-red-500 bg-red-500" : "border-slate-300"}`} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentStep;