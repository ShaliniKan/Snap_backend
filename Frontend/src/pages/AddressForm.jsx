import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountPageLayout from "../components/layout/account/AccountPageLayout";
import SectionState from "../components/common/SectionState";
import AddressFormFields, {
    AddressFormHeader,
    emptySnapdealAddressForm,
    mapAddressToForm,
    mapFormToAddressPayload,
} from "../components/layout/account/AddressFormFields";
import { useAuth } from "../context/AuthContext";
import {
    addCustomerAddress,
    getCustomerProfile,
    updateCustomerAddress,
} from "../services/userService";
import { ROUTES } from "../routes/routePaths";

const AddressForm = () => {
    const { addressId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = Boolean(addressId);

    const [form, setForm] = useState(emptySnapdealAddressForm);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const registeredMobile = useMemo(() => user?.phoneNumber || user?.mobile || "", [user]);

    useEffect(() => {
        if (!isEditMode) {
            const defaultName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
            setForm((current) => ({
                ...current,
                fullName: defaultName,
                phoneNumber: registeredMobile,
                useRegisteredMobile: Boolean(registeredMobile),
            }));
            return;
        }

        const loadAddress = async () => {
            setLoading(true);
            setError("");

            try {
                const profile = await getCustomerProfile();
                const address = profile?.addresses?.find((entry) => entry._id === addressId);

                if (!address) {
                    setError("Address not found.");
                    return;
                }

                setForm(mapAddressToForm(address));
            } catch (err) {
                setError(err.response?.data?.message || "We could not load this address.");
            } finally {
                setLoading(false);
            }
        };

        loadAddress();
    }, [addressId, isEditMode, registeredMobile, user?.firstName, user?.lastName]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!form.city || !form.state) {
            setError("Enter a valid pincode to populate city and state.");
            return;
        }

        try {
            setIsSaving(true);
            const payload = mapFormToAddressPayload(form);

            if (isEditMode) {
                await updateCustomerAddress(addressId, payload);
            } else {
                await addCustomerAddress(payload);
            }

            navigate(ROUTES.customer.addresses);
        } catch (err) {
            setError(err.response?.data?.message || "We could not save this address.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <AccountPageLayout pageTitle="" breadcrumbCurrent="My Address" hideTitle>
                <SectionState>Loading address form...</SectionState>
            </AccountPageLayout>
        );
    }

    return (
        <AccountPageLayout pageTitle="" breadcrumbCurrent="My Address" hideTitle>
            <AddressFormHeader title={isEditMode ? "Edit Your Address" : "Enter Your Address"} />
            <AddressFormFields
                error={error}
                form={form}
                isSaving={isSaving}
                onSubmit={handleSubmit}
                registeredMobile={registeredMobile}
                setForm={setForm}
            />
        </AccountPageLayout>
    );
};

export default AddressForm;
