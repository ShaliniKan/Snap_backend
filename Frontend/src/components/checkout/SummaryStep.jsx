const SummaryStep = ({ contactDetails, onContactChange }) => {
    return (
        <div className="space-y-5">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Summary</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Contact details</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
                    <div className="flex gap-2">
                        <select
                            className="rounded-sm border border-slate-200 px-3 py-3 text-sm outline-none"
                            value={contactDetails.countryCode}
                            onChange={(event) => onContactChange((current) => ({ ...current, countryCode: event.target.value }))}
                        >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                        </select>
                        <input
                            type="tel"
                            className="flex-1 rounded-sm border border-slate-200 px-3 py-3 text-sm outline-none"
                            placeholder="Enter your mobile number"
                            value={contactDetails.phone}
                            onChange={(event) => onContactChange((current) => ({ ...current, phone: event.target.value }))}
                        />
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={contactDetails.notifyOffers}
                        onChange={(event) => onContactChange((current) => ({ ...current, notifyOffers: event.target.checked }))}
                    />
                    Notify me with offers and updates
                </label>
            </div>
        </div>
    );
};

export default SummaryStep;