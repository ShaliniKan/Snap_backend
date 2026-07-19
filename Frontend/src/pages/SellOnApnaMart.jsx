import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routePaths";

const stats = [
    {
        title: "Crores of Customers",
        description: "Customers buying across India",
        icon: "👥",
        accent: "bg-blue-100 text-blue-600",
    },
    {
        title: "Lakhs of Trusted Sellers",
        description: "Existing sellers on ApnaMart",
        icon: "🏪",
        accent: "bg-emerald-100 text-emerald-600",
    },
    {
        title: "Thousands of Pincodes",
        description: "Serviceable delivery locations",
        icon: "📍",
        accent: "bg-amber-100 text-amber-600",
    },
    {
        title: "Hundreds of Categories",
        description: "Product categories available for selling",
        icon: "📦",
        accent: "bg-purple-100 text-purple-600",
    },
];

const benefits = [
    "Zero Registration Fees",
    "Zero Cancellation Fees",
    "Zero Closing Fee",
    "Zero RTO Fees",
];

const steps = [
    {
        step: 1,
        title: "Register Yourself",
        description: "Mobile Number, Email, GST, Bank Details",
        icon: "📝",
    },
    {
        step: 2,
        title: "Store Details",
        description: "Pickup address and other business information",
        icon: "🏠",
    },
    {
        step: 3,
        title: "List Your Products",
        description: "Product listing, brand details, start selling",
        icon: "🛍️",
    },
    {
        step: 4,
        title: "Payments",
        description: "Receive payments after the customer receives the order",
        icon: "💰",
    },
];

const socialLinks = [
    { label: "X", href: "https://x.com", icon: "𝕏" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
    { label: "Instagram", href: "https://instagram.com", icon: "◎" },
    { label: "YouTube", href: "https://youtube.com", icon: "▶" },
];

const SellOnApnaMart = () => {
    const { openLogin, openRegisterVendor } = useAuth();
    const [mobile, setMobile] = useState("");

    const handleStartSelling = () => {
        openRegisterVendor();
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link className="flex h-9 w-[148px] shrink-0 items-center" to={ROUTES.public.home}>
                        <img src="/Mainlogo.jpg" alt="ApnaMart" className="h-full w-full object-contain" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="hidden text-sm text-slate-600 sm:inline">Already a user?</span>
                        <button
                            className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            onClick={() => openLogin("vendor")}
                            type="button"
                        >
                            Login
                        </button>
                        <button
                            className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                            onClick={handleStartSelling}
                            type="button"
                        >
                            Start Selling
                        </button>
                    </div>
                </div>
            </header>

            <section className="bg-gradient-to-br from-red-50 via-white to-orange-50">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-16">
                    <div>
                        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Start Selling on ApnaMart at{" "}
                            <span className="text-red-500">0% Commission</span>*
                        </h1>
                        <p className="mt-4 text-base text-slate-600 sm:text-lg">
                            Join thousands of sellers and reach customers across India with zero commission on your sales.
                        </p>

                        <div className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                            <div className="flex flex-1 overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
                                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                                    +91
                                </span>
                                <input
                                    className="w-full px-3 py-3 text-sm outline-none"
                                    inputMode="numeric"
                                    maxLength={10}
                                    onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))}
                                    placeholder="Enter mobile number"
                                    type="tel"
                                    value={mobile}
                                />
                            </div>
                            <button
                                className="rounded-sm bg-red-500 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:bg-red-600 sm:shrink-0"
                                onClick={handleStartSelling}
                                type="button"
                            >
                                Start Selling
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">*Terms and conditions apply</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 p-8 shadow-xl">
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />
                            <div className="relative text-center">
                                <p className="text-7xl font-black leading-none text-white sm:text-8xl">0%</p>
                                <p className="mt-2 text-xl font-bold uppercase tracking-widest text-red-100">
                                    Commission
                                </p>
                            </div>
                            <div className="absolute bottom-4 right-6 hidden sm:block">
                                <div className="flex h-28 w-20 flex-col items-center justify-end">
                                    <div className="mb-1 h-10 w-10 rounded-full bg-amber-200" />
                                    <div className="h-16 w-12 rounded-t-full bg-slate-800" />
                                    <div className="mt-1 h-2 w-16 rounded-full bg-slate-700" />
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {benefits.map((benefit) => (
                                <li key={benefit} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
                                        ✓
                                    </span>
                                    <span className="text-base font-semibold text-slate-800">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-100 bg-slate-50">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
                    {stats.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl ${item.accent}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">Seller onboarding</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">How to Sell on ApnaMart</h2>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((item) => (
                        <div
                            key={item.step}
                            className="relative rounded-sm border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                                {item.step}
                            </span>
                            <div className="mt-4 flex h-20 items-center justify-center rounded-lg bg-slate-50 text-4xl">
                                {item.icon}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="bg-slate-900 text-slate-300">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                    <p className="text-sm">© {new Date().getFullYear()} ApnaMart. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                aria-label={link.label}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 text-sm font-semibold transition hover:border-red-400 hover:text-white"
                                href={link.href}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SellOnApnaMart;
