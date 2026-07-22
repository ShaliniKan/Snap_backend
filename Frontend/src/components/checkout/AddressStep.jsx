const AddressStep = ({ address, onAddressChange, deliveryInfo, deliveryError, onPincodeCheck }) => {
  const fields = [
    { key: "name", label: "Name", placeholder: "Enter full name", required: true },
    { key: "mobile", label: "Mobile", placeholder: "Enter mobile number", required: true },
    { key: "pincode", label: "Pincode", placeholder: "Enter pincode", required: true },
    { key: "houseNo", label: "House No", placeholder: "House / Flat No", required: true },
    { key: "street", label: "Street", placeholder: "Street name", required: false },
    { key: "area", label: "Area", placeholder: "Area / Locality", required: false },
    { key: "city", label: "City", placeholder: "City", required: true },
    { key: "state", label: "State", placeholder: "State", required: true },
    { key: "landmark", label: "Landmark", placeholder: "Nearby landmark", required: false },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Address</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Delivery address</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.key === "landmark" ? "sm:col-span-2" : ""}>
            <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
            <input
              className="w-full rounded-sm border border-slate-200 px-3 py-3 text-sm outline-none focus:border-red-300"
              placeholder={field.placeholder}
              value={address[field.key]}
              onChange={(event) => {
                const value = event.target.value;
                onAddressChange((current) => ({ ...current, [field.key]: value }));
                if (field.key === "pincode" && value.length === 6) {
                  onPincodeCheck?.(value);
                }
              }}
              onBlur={field.key === "pincode" ? () => onPincodeCheck?.(address.pincode) : undefined}
            />
          </div>
        ))}
      </div>

      {deliveryError && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{deliveryError}</p>
      )}

      {deliveryInfo && !deliveryError && (
        <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Delivery available{deliveryInfo.city ? ` to ${deliveryInfo.city}` : ""}. Estimated {deliveryInfo.estimatedDays} day(s).
          {deliveryInfo.deliveryCharge > 0 ? ` Delivery charge: ₹${deliveryInfo.deliveryCharge}.` : " Free delivery."}
        </div>
      )}
    </div>
  );
};

export default AddressStep;
