import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountPageLayout from "../components/layout/account/AccountPageLayout";
import SectionState from "../components/common/SectionState";
import { deleteCustomerAddress, getCustomerProfile, setDefaultCustomerAddress } from "../services/userService";
import { ROUTES } from "../routes/routePaths";

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAddresses = async () => {
        setLoading(true);
        setError("");

        try {
            const profile = await getCustomerProfile();
            setAddresses(profile?.addresses || []);
        } catch (err) {
            setError(err.response?.data?.message || "We could not load your saved addresses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleDelete = async (addressId) => {
        try {
            const profile = await deleteCustomerAddress(addressId);
            setAddresses(profile?.addresses || []);
        } catch (err) {
            setError(err.response?.data?.message || "We could not remove this address.");
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const profile = await setDefaultCustomerAddress(addressId);
            setAddresses(profile?.addresses || []);
        } catch (err) {
            setError(err.response?.data?.message || "We could not update the default address.");
        }
    };

    if (loading) {
        return (
            <AccountPageLayout pageTitle="Saved Addresses" breadcrumbCurrent="My Address">
                <SectionState>Loading your addresses...</SectionState>
            </AccountPageLayout>
        );
    }

    return (
        <AccountPageLayout pageTitle="Saved Addresses" breadcrumbCurrent="My Address">
            {error && (
                <p className="mb-4 text-[13px] text-[#e40046]" role="alert">
                    {error}
                </p>
            )}

            {addresses.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <p className="text-[14px] font-normal text-[#666666]">You do not have any saved address</p>
                    <Link
                        to={ROUTES.customer.addressNew}
                        className="mt-8 bg-[#e40046] px-10 py-3 text-[13px] font-normal uppercase tracking-wide text-white transition hover:bg-[#c9003c]"
                    >
                        Add New Address
                    </Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {addresses.map((address) => (
                        <article key={address._id} className="border border-[#e0e0e0] p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-[14px] font-normal uppercase text-[#333333]">
                                            {address.addressType === "work" ? "Office/Commercial" : "Home"}
                                        </p>
                                        {address.isDefault && (
                                            <span className="text-[11px] uppercase text-[#666666]">Default</span>
                                        )}
                                    </div>
                                    {address.fullName && (
                                        <p className="mt-2 text-[14px] text-[#333333]">{address.fullName}</p>
                                    )}
                                    <p className="mt-1 text-[13px] leading-6 text-[#666666]">{address.addressLine1}</p>
                                    {address.addressLine2 && (
                                        <p className="text-[13px] leading-6 text-[#666666]">{address.addressLine2}</p>
                                    )}
                                    <p className="text-[13px] leading-6 text-[#666666]">
                                        {address.city}, {address.state} {address.postalCode}
                                    </p>
                                    {address.phoneNumber && (
                                        <p className="mt-1 text-[13px] text-[#666666]">+91 {address.phoneNumber}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {!address.isDefault && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(address._id)}
                                            className="border border-[#e0e0e0] px-3 py-1.5 text-[12px] text-[#333333] hover:border-[#e40046] hover:text-[#e40046]"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <Link
                                        to={ROUTES.customer.addressEdit.replace(":addressId", address._id)}
                                        className="border border-[#e0e0e0] px-3 py-1.5 text-[12px] text-[#333333] hover:border-[#e40046] hover:text-[#e40046]"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(address._id)}
                                        className="border border-[#f5c2cf] px-3 py-1.5 text-[12px] text-[#e40046]"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}

                    <div className="pt-4">
                        <Link
                            to={ROUTES.customer.addressNew}
                            className="inline-block bg-[#e40046] px-10 py-3 text-[13px] font-normal uppercase tracking-wide text-white transition hover:bg-[#c9003c]"
                        >
                            Add New Address
                        </Link>
                    </div>
                </div>
            )}
        </AccountPageLayout>
    );
};

export default SavedAddresses;
