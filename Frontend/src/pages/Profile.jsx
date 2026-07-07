import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionState from "../components/common/SectionState";
import { useAuth } from "../context/AuthContext";
import {
    addCustomerAddress,
    deleteCustomerAddress,
    getCustomerProfile,
    setDefaultCustomerAddress,
    updateCustomerProfile,
    updateCustomerAddress,
} from "../services/userService";
import { ROUTES } from "../routes/routePaths";

const emptyAddressForm = {
    addressType: "home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    phoneNumber: "",
    isDefault: false,
};

const Profile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [profileForm, setProfileForm] = useState({ dateOfBirth: "", gender: "" });
    const [addressForm, setAddressForm] = useState(emptyAddressForm);
    const [editingAddressId, setEditingAddressId] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);

    const loadProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getCustomerProfile();
            setProfile(data);
            setProfileForm({
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
                gender: data.gender || "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "We could not load your profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleProfileSave = async (event) => {
        event.preventDefault();

        try {
            setIsSavingProfile(true);
            setError("");
            const data = await updateCustomerProfile(profileForm);
            setProfile(data);
            setSuccessMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.response?.data?.message || "We could not update your profile.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const resetAddressForm = () => {
        setAddressForm(emptyAddressForm);
        setEditingAddressId("");
    };

    const handleAddressSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSavingAddress(true);
            setError("");

            const data = editingAddressId
                ? await updateCustomerAddress(editingAddressId, addressForm)
                : await addCustomerAddress(addressForm);

            setProfile(data);
            setSuccessMessage(editingAddressId ? "Address updated successfully." : "Address added successfully.");
            resetAddressForm();
        } catch (err) {
            setError(err.response?.data?.message || "We could not save this address.");
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address._id);
        setAddressForm({
            addressType: address.addressType || "home",
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            city: address.city || "",
            state: address.state || "",
            country: address.country || "India",
            postalCode: address.postalCode || "",
            phoneNumber: address.phoneNumber || "",
            isDefault: Boolean(address.isDefault),
        });
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            setError("");
            const data = await deleteCustomerAddress(addressId);
            setProfile(data);
            setSuccessMessage("Address removed successfully.");

            if (editingAddressId === addressId) {
                resetAddressForm();
            }
        } catch (err) {
            setError(err.response?.data?.message || "We could not remove this address.");
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            setError("");
            const data = await setDefaultCustomerAddress(addressId);
            setProfile(data);
            setSuccessMessage("Default address updated.");
        } catch (err) {
            setError(err.response?.data?.message || "We could not update the default address.");
        }
    };

    if (loading) {
        return <SectionState>Loading your profile...</SectionState>;
    }

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">My Account</p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-900">Profile</h1>
                    <p className="mt-1 text-sm text-slate-500">{displayName} · {user?.email}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link
                        to={ROUTES.customer.cart}
                        className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        My Cart
                    </Link>
                    <button
                        type="button"
                        onClick={logout}
                        className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {successMessage}
                </div>
            )}

            <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Personal Details</h2>
                <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleProfileSave}>
                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Date of birth</span>
                        <input
                            type="date"
                            value={profileForm.dateOfBirth}
                            onChange={(event) => setProfileForm((current) => ({ ...current, dateOfBirth: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Gender</span>
                        <select
                            value={profileForm.gender}
                            onChange={(event) => setProfileForm((current) => ({ ...current, gender: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="rounded-sm bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            {isSavingProfile ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Saved Addresses</h2>
                    {editingAddressId && (
                        <button type="button" onClick={resetAddressForm} className="text-sm font-semibold text-red-500">
                            Cancel edit
                        </button>
                    )}
                </div>

                <div className="mt-4 space-y-3">
                    {(profile?.addresses || []).length === 0 ? (
                        <p className="text-sm text-slate-500">You have not saved any addresses yet.</p>
                    ) : (
                        profile.addresses.map((address) => (
                            <article key={address._id} className="rounded-sm border border-slate-200 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold uppercase text-slate-700">{address.addressType}</p>
                                            {address.isDefault && (
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Default</span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">{address.addressLine1}</p>
                                        {address.addressLine2 && <p className="text-sm text-slate-600">{address.addressLine2}</p>}
                                        <p className="text-sm text-slate-600">{address.city}, {address.state} {address.postalCode}</p>
                                        <p className="text-sm text-slate-600">{address.country}</p>
                                        {address.phoneNumber && <p className="mt-1 text-sm text-slate-500">Phone: {address.phoneNumber}</p>}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {!address.isDefault && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetDefaultAddress(address._id)}
                                                className="rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                            >
                                                Set default
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleEditAddress(address)}
                                            className="rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAddress(address._id)}
                                            className="rounded-sm border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                <form className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2" onSubmit={handleAddressSubmit}>
                    <h3 className="sm:col-span-2 text-base font-semibold text-slate-900">
                        {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h3>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Address type</span>
                        <select
                            value={addressForm.addressType}
                            onChange={(event) => setAddressForm((current) => ({ ...current, addressType: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                        >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                        </select>
                    </label>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Phone number</span>
                        <input
                            type="tel"
                            value={addressForm.phoneNumber}
                            onChange={(event) => setAddressForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                            placeholder="9876543210"
                            required
                        />
                    </label>

                    <label className="block text-sm sm:col-span-2">
                        <span className="font-medium text-slate-700">Address line 1</span>
                        <input
                            type="text"
                            value={addressForm.addressLine1}
                            onChange={(event) => setAddressForm((current) => ({ ...current, addressLine1: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                            required
                        />
                    </label>

                    <label className="block text-sm sm:col-span-2">
                        <span className="font-medium text-slate-700">Address line 2</span>
                        <input
                            type="text"
                            value={addressForm.addressLine2}
                            onChange={(event) => setAddressForm((current) => ({ ...current, addressLine2: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">City</span>
                        <input
                            type="text"
                            value={addressForm.city}
                            onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                            required
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">State</span>
                        <input
                            type="text"
                            value={addressForm.state}
                            onChange={(event) => setAddressForm((current) => ({ ...current, state: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                            required
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Postal code</span>
                        <input
                            type="text"
                            value={addressForm.postalCode}
                            onChange={(event) => setAddressForm((current) => ({ ...current, postalCode: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                            required
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="font-medium text-slate-700">Country</span>
                        <input
                            type="text"
                            value={addressForm.country}
                            onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))}
                            className="mt-1 w-full rounded-sm border border-slate-200 px-3 py-2"
                            required
                        />
                    </label>

                    <label className="flex items-center gap-2 text-sm sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))}
                        />
                        <span className="text-slate-700">Set as default address</span>
                    </label>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            disabled={isSavingAddress}
                            className="rounded-sm bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            {isSavingAddress ? "Saving..." : editingAddressId ? "Update Address" : "Add Address"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default Profile;
