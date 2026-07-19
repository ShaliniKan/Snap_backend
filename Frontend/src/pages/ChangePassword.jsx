import { useState } from "react";
import AccountPageLayout from "../components/layout/account/AccountPageLayout";
import { changeCustomerPassword } from "../services/userService";

const passwordHelpText =
    "Password should have a minimum of 6 characters, at least 1 numeric and 1 alphabet";

const isValidPassword = (password) =>
    password.length >= 6 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password);

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!isValidPassword(newPassword)) {
            setError(passwordHelpText);
            return;
        }

        try {
            setIsSubmitting(true);
            await changeCustomerPassword(newPassword);
            setSuccessMessage("Your password has been updated successfully.");
            setNewPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "We could not update your password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AccountPageLayout pageTitle="Change Password" breadcrumbCurrent="Change Password">
            <form className="max-w-3xl" onSubmit={handleSubmit}>
                {error && (
                    <p className="mb-4 text-[13px] text-[#e40046]" role="alert">
                        {error}
                    </p>
                )}

                {successMessage && (
                    <p className="mb-4 text-[13px] text-emerald-700" role="status">
                        {successMessage}
                    </p>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-8">
                    <label
                        htmlFor="new-password"
                        className="shrink-0 pt-2.5 text-[14px] font-normal text-[#666666] sm:w-[170px]"
                    >
                        New Password <span className="text-[#666666]">*</span>
                    </label>
                    <div className="min-w-0 flex-1 max-w-[520px]">
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            placeholder="Enter your new password"
                            className="w-full border border-[#e0e0e0] px-3 py-2.5 text-[14px] text-[#333333] outline-none focus:border-[#bdbdbd]"
                            autoComplete="new-password"
                            required
                        />
                        <p className="mt-2 text-[11px] leading-relaxed text-[#999999]">{passwordHelpText}</p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:gap-8">
                    <span className="hidden shrink-0 sm:block sm:w-[170px]" />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[140px] bg-[#333333] px-10 py-3 text-[13px] font-normal uppercase tracking-wide text-white transition hover:bg-[#222222] disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </AccountPageLayout>
    );
};

export default ChangePassword;
