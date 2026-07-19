import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkPincode } from "../../../services/deliveryService";
import { ROUTES } from "../../../routes/routePaths";

const inputClass = "w-full border border-[#e0e0e0] px-3 py-2.5 text-[14px] text-[#333333] outline-none focus:border-[#bdbdbd]";
const readOnlyClass = "w-full border border-[#e0e0e0] bg-[#f2f2f2] px-3 py-2.5 text-[14px] text-[#666666] outline-none";

const FormRow = ({ label, children, labelWidth = "w-[170px]" }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
        <span className={`shrink-0 pt-2.5 text-[14px] font-normal text-[#333333] ${labelWidth}`}>{label}</span>
        <div className="min-w-0 flex-1 max-w-[520px]">{children}</div>
    </div>
);

export const emptySnapdealAddressForm = {
    fullName: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    phoneNumber: "",
    alternatePhoneNumber: "",
    addressType: "home",
    isDefault: false,
    useRegisteredMobile: false,
};

export const mapAddressToForm = (address) => ({
    fullName: address.fullName || "",
    postalCode: address.postalCode || "",
    addressLine1: address.addressLine1 || "",
    addressLine2: address.addressLine2 || "",
    city: address.city || "",
    state: address.state || "",
    country: address.country || "India",
    phoneNumber: address.phoneNumber || "",
    alternatePhoneNumber: address.alternatePhoneNumber || "",
    addressType: address.addressType === "work" ? "office" : "home",
    isDefault: Boolean(address.isDefault),
    useRegisteredMobile: false,
});

export const mapFormToAddressPayload = (form) => {
    const payload = {
        fullName: form.fullName.trim(),
        postalCode: form.postalCode.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim() || "India",
        phoneNumber: form.phoneNumber.trim(),
        addressType: form.addressType === "office" ? "work" : "home",
        isDefault: Boolean(form.isDefault),
    };

    if (form.alternatePhoneNumber.trim()) {
        payload.alternatePhoneNumber = form.alternatePhoneNumber.trim();
    }

    return payload;
};

const AddressFormFields = ({
    form,
    setForm,
    registeredMobile = "",
    onSubmit,
    isSaving = false,
    error = "",
}) => {
    const [pincodeError, setPincodeError] = useState("");

    useEffect(() => {
        if (!form.useRegisteredMobile || !registeredMobile) {
            return;
        }

        setForm((current) => ({ ...current, phoneNumber: registeredMobile }));
    }, [form.useRegisteredMobile, registeredMobile, setForm]);

    const handlePincodeChange = async (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 6);
        setPincodeError("");
        setForm((current) => ({
            ...current,
            postalCode: digits,
            city: digits.length === 6 ? current.city : "",
            state: digits.length === 6 ? current.state : "",
        }));

        if (digits.length !== 6) {
            return;
        }

        try {
            const result = await checkPincode(digits);
            setForm((current) => ({
                ...current,
                city: result?.city || "",
                state: result?.state || "",
            }));

            if (!result?.city && !result?.state) {
                setPincodeError("City and state could not be resolved for this pincode.");
            }
        } catch (err) {
            setPincodeError(err.response?.data?.message || "Could not verify pincode.");
            setForm((current) => ({ ...current, city: "", state: "" }));
        }
    };

    return (
        <form className="space-y-7" onSubmit={onSubmit}>
            {error && (
                <p className="text-[13px] text-[#e40046]" role="alert">
                    {error}
                </p>
            )}

            <FormRow label="Pincode">
                <input
                    type="text"
                    inputMode="numeric"
                    value={form.postalCode}
                    onChange={(event) => handlePincodeChange(event.target.value)}
                    placeholder="Enter 6 digit pincode"
                    className={inputClass}
                    maxLength={6}
                    required
                />
                {pincodeError && <p className="mt-1 text-[12px] text-[#e40046]">{pincodeError}</p>}
            </FormRow>

            <FormRow label="Name">
                <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="Full Name"
                    className={inputClass}
                    required
                />
            </FormRow>

            <FormRow label="Address">
                <textarea
                    rows={3}
                    value={form.addressLine1}
                    onChange={(event) => setForm((current) => ({ ...current, addressLine1: event.target.value }))}
                    placeholder="Flat/House No. Colony/Street No."
                    className={`${inputClass} resize-none`}
                    required
                />
            </FormRow>

            <FormRow label="Locality/Landmark">
                <div>
                    <input
                        type="text"
                        value={form.addressLine2}
                        onChange={(event) => setForm((current) => ({ ...current, addressLine2: event.target.value }))}
                        placeholder="Eg Near Fortis Hospital"
                        className={inputClass}
                    />
                    <button type="button" className="mt-2 text-[12px] text-[#2f82c6] hover:underline">
                        (Learn More)
                    </button>
                </div>
            </FormRow>

            <FormRow label="City">
                <input type="text" value={form.city} readOnly className={readOnlyClass} placeholder="" />
            </FormRow>

            <FormRow label="State">
                <input type="text" value={form.state} readOnly className={readOnlyClass} placeholder="" />
            </FormRow>

            <FormRow label="Mobile Number">
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[13px] text-[#333333]">
                        <input
                            type="checkbox"
                            checked={form.useRegisteredMobile}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    useRegisteredMobile: event.target.checked,
                                    phoneNumber: event.target.checked ? registeredMobile : current.phoneNumber,
                                }))
                            }
                        />
                        Same as registered mobile
                    </label>
                    <div className="flex">
                        <span className="flex items-center border border-r-0 border-[#e0e0e0] bg-[#fafafa] px-3 text-[14px] text-[#666666]">
                            +91
                        </span>
                        <input
                            type="tel"
                            value={form.phoneNumber}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    phoneNumber: event.target.value.replace(/\D/g, "").slice(0, 10),
                                    useRegisteredMobile: false,
                                }))
                            }
                            placeholder="10 digit mobile number"
                            className={`${inputClass} border-l-0`}
                            maxLength={10}
                            required
                        />
                    </div>
                    <button type="button" className="text-[12px] text-[#2f82c6] hover:underline">
                        (Learn More)
                    </button>
                </div>
            </FormRow>

            <FormRow label="Alternate Mobile No.">
                <div>
                    <div className="flex">
                        <span className="flex items-center border border-r-0 border-[#e0e0e0] bg-[#fafafa] px-3 text-[14px] text-[#666666]">
                            +91
                        </span>
                        <input
                            type="tel"
                            value={form.alternatePhoneNumber}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    alternatePhoneNumber: event.target.value.replace(/\D/g, "").slice(0, 10),
                                }))
                            }
                            placeholder="10 digit mobile number"
                            className={`${inputClass} border-l-0`}
                            maxLength={10}
                        />
                    </div>
                    <button type="button" className="mt-2 text-[12px] text-[#2f82c6] hover:underline">
                        (Learn More)
                    </button>
                </div>
            </FormRow>

            <FormRow label="Address Type">
                <div className="flex flex-wrap gap-6 pt-2 text-[14px] text-[#333333]">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="addressType"
                            checked={form.addressType === "home"}
                            onChange={() => setForm((current) => ({ ...current, addressType: "home" }))}
                        />
                        Home
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="addressType"
                            checked={form.addressType === "office"}
                            onChange={() => setForm((current) => ({ ...current, addressType: "office" }))}
                        />
                        Office/Commercial
                    </label>
                </div>
            </FormRow>

            <FormRow label="">
                <label className="flex items-center gap-2 text-[14px] text-[#333333]">
                    <input
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))}
                    />
                    Make this my default address
                </label>
            </FormRow>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                <span className="hidden w-[170px] shrink-0 sm:block" />
                <button
                    type="submit"
                    disabled={isSaving}
                    className="min-w-[140px] bg-[#333333] px-10 py-3 text-[13px] font-normal uppercase tracking-wide text-white transition hover:bg-[#222222] disabled:opacity-60"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
};

export const AddressFormHeader = ({ title = "Enter Your Address" }) => (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-normal text-[#333333]">{title}</h2>
        <Link to={ROUTES.customer.addresses} className="text-[13px] text-[#2f82c6] hover:underline">
            Back To Saved Addresses
        </Link>
    </div>
);

export default AddressFormFields;
