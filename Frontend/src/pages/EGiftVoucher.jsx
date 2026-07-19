import { useState } from "react";
import AccountPageLayout from "../components/layout/account/AccountPageLayout";

const PinVisibilityIcon = ({ visible }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        {visible ? (
            <>
                <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
                <circle cx="12" cy="12" r="2.5" />
            </>
        ) : (
            <>
                <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
                <path d="M4 4 20 20" strokeLinecap="round" />
            </>
        )}
    </svg>
);

const EGiftVoucher = () => {
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherPin, setVoucherPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [message, setMessage] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!voucherCode.trim() || !voucherPin.trim()) {
            setMessage("Please enter e-Gift Voucher Code and Pin.");
            return;
        }

        setIsChecking(true);

        // Placeholder until voucher API is available.
        await new Promise((resolve) => setTimeout(resolve, 600));
        setMessage("We could not find a voucher with the details provided.");
        setIsChecking(false);
    };

    return (
        <AccountPageLayout
            pageTitle="Check E-Gift Voucher Balance"
            breadcrumbCurrent="My E-GIFT Voucher Balance"
            titleExtra={
                <>
                    <span className="text-[14px] font-light text-[#cccccc]">|</span>
                    <a href="/" className="text-[13px] font-normal normal-case text-[#2f82c6] hover:underline">
                        ABOUT E-GIFT VOUCHER &gt;
                    </a>
                </>
            }
        >
            <form className="flex flex-col gap-10 pt-2 lg:flex-row lg:items-start lg:gap-16" onSubmit={handleSubmit}>
                <div className="w-full max-w-[420px] space-y-8">
                    <label className="block">
                        <span className="mb-2 block text-[14px] font-normal text-[#333333]">e-Gift Voucher Code</span>
                        <input
                            type="text"
                            value={voucherCode}
                            onChange={(event) => setVoucherCode(event.target.value)}
                            className="w-full border-0 border-b-2 border-[#e40046] bg-[#eff7ff] px-3 py-2.5 text-[14px] text-[#333333] outline-none"
                            autoComplete="off"
                        />
                    </label>

                    <div>
                        <label className="block">
                            <span className="mb-2 block text-[14px] font-normal text-[#333333]">e-Gift Voucher Pin</span>
                            <div className="relative">
                                <input
                                    type={showPin ? "text" : "password"}
                                    value={voucherPin}
                                    onChange={(event) => setVoucherPin(event.target.value)}
                                    className="w-full border-0 border-b-2 border-[#e40046] bg-[#eff7ff] px-3 py-2.5 pr-10 text-[14px] text-[#333333] outline-none"
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    aria-label={showPin ? "Hide voucher pin" : "Show voucher pin"}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#333333]"
                                    onClick={() => setShowPin((current) => !current)}
                                >
                                    <PinVisibilityIcon visible={showPin} />
                                </button>
                            </div>
                        </label>

                        <button
                            type="button"
                            className="mt-3 text-[12px] font-normal text-[#2f82c6] hover:underline"
                        >
                            Forgot e-Gift Voucher Pin
                        </button>
                    </div>

                    {message && (
                        <p className="text-[13px] text-[#e40046]" role="alert">
                            {message}
                        </p>
                    )}
                </div>

                <div className="lg:pt-7">
                    <button
                        type="submit"
                        disabled={isChecking}
                        className="min-w-[160px] bg-[#333333] px-8 py-3 text-[13px] font-normal uppercase tracking-wide text-white transition hover:bg-[#222222] disabled:opacity-60"
                    >
                        {isChecking ? "Checking..." : "Check Balance"}
                    </button>
                </div>
            </form>
        </AccountPageLayout>
    );
};

export default EGiftVoucher;
