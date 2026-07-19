import {
    BUSINESS_LINKS,
    COMPANY_LINKS,
    POLICY_LINKS,
    POPULAR_LINKS,
    SEO_CATEGORIES,
    SOCIAL_LINKS,
    TRUST_BADGES,
} from "../../utils/footerContent";

const FooterColumn = ({ title, links, productStyle = false }) => (
    <div>
        <h3
            className={
                productStyle
                    ? "mb-3 text-[13px] font-normal uppercase tracking-wide text-[#212121]"
                    : "mb-3 text-xs font-bold uppercase tracking-wide text-slate-900"
            }
        >
            {title}
        </h3>
        <ul className="space-y-2">
            {links.map((link) => (
                <li key={link}>
                    <a
                        className={
                            productStyle
                                ? "text-[12px] text-[#757575] transition hover:text-[#e40046]"
                                : "text-xs text-slate-600 transition hover:text-[#e40046]"
                        }
                        href="/"
                    >
                        {link}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const PaymentIcons = () => (
    <div>
        <img alt="Accepted Payment Methods" className="h-10 w-auto object-contain" src="/paymentmodesimage.avif" />
    </div>
);

const SocialIcon = ({ icon, label }) => {
    const icons = {
        facebook: (
            <path d="M9 8h3V6.2c0-.9.1-1.6.4-2.1.6-1 1.8-1.4 3-1.4 1 0 1.8.1 2.4.2v2.8h-1.7c-1 0-1.2.5-1.2 1.2V8H16l-.4 2.5h-2.1v7.5H9V10.5H7V8h2z" />
        ),
        x: <path d="M14.5 6h2.3l-5 5.7L17.8 18h-2.4l-3.6-4.7L8 18H5.7l5.3-6.1L5 6h2.5l3.2 4.2L14.5 6zm-.8 10.8h1.3L8.6 7.2H7.2l6.5 9.6z" />,
        instagram: (
            <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm5.4-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 5.4c-1.2 0-1.4 0-1.9 0-.5 0-.8.1-1 .2-.3.1-.5.2-.7.4-.2.2-.3.4-.4.7-.1.2-.2.5-.2 1-.1.5-.1.7-.1 1.9s0 1.4.1 1.9c0 .5.1.8.2 1 .1.3.2.5.4.7.2.2.4.3.7.4.2.1.5.2 1 .2.5.1.7.1 1.9.1s1.4 0 1.9-.1c.5 0 .8-.1 1-.2.3-.1.5-.2.7-.4.2-.2.3-.4.4-.7.1-.2.2-.5.2-1 .1-.5.1-.7.1-1.9s0-1.4-.1-1.9c0-.5-.1-.8-.2-1-.1-.3-.2-.5-.4-.7-.2-.2-.4-.3-.7-.4-.2-.1-.5-.2-1-.2-.5-.1-.7-.1-1.9-.1zm0-1.7c1.2 0 1.4 0 1.9.1.5 0 1 .1 1.4.3.4.2.7.4 1 .7.3.3.5.6.7 1 .2.4.3.9.3 1.4.1.5.1.7.1 1.9s0 1.4-.1 1.9c0 .5-.1 1-.3 1.4-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.4.2-.9.3-1.4.3-.5.1-.7.1-1.9.1s-1.4 0-1.9-.1c-.5 0-1-.1-1.4-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.2-.4-.3-.9-.3-1.4-.1-.5-.1-.7-.1-1.9s0-1.4.1-1.9c0-.5.1-1 .3-1.4.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.4-.2.9-.3 1.4-.3.5-.1.7-.1 1.9-.1z" />
        ),
        linkedin: (
            <path d="M8.2 9.3H6V18h2.2V9.3zM7.1 8.1c.7 0 1.2-.5 1.2-1.2S7.8 5.7 7.1 5.7 5.9 6.2 5.9 6.9s.5 1.2 1.2 1.2zM18 18h-2.2v-4.7c0-1.1 0-2.6-1.6-2.6-1.6 0-1.8 1.2-1.8 2.5V18h-2.2V9.3h2.1v1.2h0c.3-.6 1-1.2 2.1-1.2 2.2 0 2.6 1.5 2.6 3.4V18z" />
        ),
        youtube: (
            <path d="M10.2 14.3V9.7l4.8 2.3-4.8 2.3zm8.9-6.8c-.2-.8-.8-1.4-1.6-1.6C15.6 5.5 12 5.5 12 5.5s-3.6 0-5.5.4c-.8.2-1.4.8-1.6 1.6C4.5 9.1 4.5 12 4.5 12s0 2.9.4 4.5c.2.8.8 1.4 1.6 1.6 1.9.4 5.5.4 5.5.4s3.6 0 5.5-.4c.8-.2 1.4-.8 1.6-1.6.4-1.6.4-4.5.4-4.5s0-2.9-.4-4.5z" />
        ),
        telegram: (
            <path d="M7.4 11.8l7.8-3.4-3.4 7.8-1.1-2.8-3.3-1.6zm10.8-4.9c.4 1.5-.9 6.6-1.3 8.8-.2.9-.6 1.2-1 1.2-.9 0-1.9-.6-2.9-1.1-1.6-.9-2.5-1.4-4-2.3-1.8-1.1-.6-1.7.4-2.7.3-.3 5.1-4.7 5.2-5.1 0-.1 0-.3-.1-.4-.1-.1-.3-.1-.4 0-.2 0-3.2 2-9 5.9-.9.6-1.6.9-2.3.9-.8-.1-2.3-.4-3.4-.8-.9-.3-1.6-.5-1.5-1.1 0-.3.5-.7 1.4-1.1 5.5-2.4 9.2-4 10.9-4.7 5.2-2.2 6.3-2.6 7-2.6.2 0 .5 0 .7.2.2.1.2.3.2.5z" />
        ),
        whatsapp: (
            <path d="M12 5.3c-3.7 0-6.7 3-6.7 6.7 0 1.2.3 2.3.9 3.3L5 19l3.9-1.2c1 .5 2.1.8 3.2.8 3.7 0 6.7-3 6.7-6.7S15.7 5.3 12 5.3zm3.8 9.5c-.2.5-1 1-1.4 1.1-.4.1-.9.2-2.9-.6-2.4-1-4-3.3-4.1-3.5-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.4.7 1.4.7 1.5.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.2.2-.1.4.1.2.5.8 1.1 1.3.8.7 1.4.9 1.6 1 .2.1.4.1.5-.1.1-.2.6-.7.7-.9.1-.2.3-.2.5-.1.2.1 1.5.7 1.8.8.2.1.4.2.4.3 0 .2-.1.7-.3 1.2z" />
        ),
    };

    return (
        <a
            aria-label={label}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-[#e40046] hover:text-[#e40046]"
            href="/"
        >
            <svg aria-hidden="true" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                {icons[icon]}
            </svg>
        </a>
    );
};

const TrustBadgeIcon = ({ type }) => {
    const iconClass = "h-8 w-8 text-slate-700";

    if (type === "shield") {
        return (
            <svg className={`${iconClass} text-emerald-600`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 3 4 6v6c0 4.4 3.1 8.5 8 9 4.9-.5 8-4.6 8-9V6l-8-3z" />
                <path d="m9.5 12 1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (type === "help") {
        return (
            <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 8a8 8 0 0 1 16 0v3l2 3H2l2-3V8z" />
                <path d="M9.5 18a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
            </svg>
        );
    }

    if (type === "mobile") {
        return (
            <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect height="16" rx="2" width="10" x="7" y="4" />
                <path d="M11 17h2" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect height="11" rx="2" width="14" x="5" y="10" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3" />
        </svg>
    );
};

export const TrustBadgesBar = ({ embedded = false, productStyle = false }) => (
    <section className="border-t border-[#e0e0e0] bg-white">
        <div
            className={`grid divide-y divide-[#e0e0e0] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 ${
                embedded ? "w-full" : "mx-auto max-w-page"
            }`}
        >
            {TRUST_BADGES.map((badge) => (
                <div key={badge.title} className="flex flex-col items-center px-6 py-8 text-center">
                    <TrustBadgeIcon type={badge.icon} />
                    <h3
                        className={
                            productStyle
                                ? "mt-4 text-[12px] font-normal uppercase tracking-wide text-[#212121]"
                                : "mt-4 text-xs font-bold uppercase tracking-wide text-slate-900"
                        }
                    >
                        {badge.title}
                    </h3>
                    <p
                        className={
                            productStyle
                                ? "mt-2 max-w-[220px] text-[12px] leading-[18px] text-[#757575]"
                                : "mt-2 max-w-[220px] text-xs leading-5 text-slate-500"
                        }
                    >
                        {badge.description}
                    </p>
                </div>
            ))}
        </div>
    </section>
);

export const FooterColumnsSection = ({ showSubscribe = false, productStyle = false }) => (
    <div className={`grid gap-8 ${showSubscribe ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        <FooterColumn links={POLICY_LINKS} productStyle={productStyle} title="Policy Info" />
        <FooterColumn links={COMPANY_LINKS} productStyle={productStyle} title="Company" />
        <FooterColumn links={BUSINESS_LINKS} productStyle={productStyle} title="Snapdeal Business" />
        <FooterColumn links={POPULAR_LINKS} productStyle={productStyle} title="Popular Links" />
        {showSubscribe && (
            <div>
                <h3
                    className={
                        productStyle
                            ? "mb-3 text-[13px] font-normal uppercase tracking-wide text-[#212121]"
                            : "mb-3 text-xs font-bold uppercase tracking-wide text-slate-900"
                    }
                >
                    Subscribe
                </h3>
                <div className="flex">
                    <input
                        className="w-full border border-[#e0e0e0] px-3 py-2 text-[12px] outline-none"
                        placeholder="Your email address"
                        type="email"
                    />
                    <button className="bg-[#333333] px-4 py-2 text-[11px] font-bold uppercase text-white" type="button">
                        Subscribe
                    </button>
                </div>
                <p className={`mt-3 leading-[18px] ${productStyle ? "text-[11px] text-[#757575]" : "text-[11px] text-slate-500"}`}>
                    Register now to get updates on promotions and coupons. Or{" "}
                    <a className="text-[#2f82c6] hover:underline" href="/">
                        Download App
                    </a>
                </p>
            </div>
        )}
    </div>
);

export const FooterPaymentSocialSection = ({ productStyle = false }) => (
    <div className="mt-10 grid gap-8 border-t border-[#e0e0e0] pt-8 lg:grid-cols-2">
        <div>
            <h3
                className={
                    productStyle
                        ? "mb-4 text-[13px] font-normal uppercase tracking-wide text-[#212121]"
                        : "mb-4 text-xs font-bold uppercase tracking-wide text-slate-900"
                }
            >
                Payment
            </h3>
            <PaymentIcons />
        </div>
        <div>
            <h3
                className={
                    productStyle
                        ? "mb-4 text-[13px] font-normal uppercase tracking-wide text-[#212121]"
                        : "mb-4 text-xs font-bold uppercase tracking-wide text-slate-900"
                }
            >
                Connect
            </h3>
            <div className="flex flex-wrap items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                    <SocialIcon key={social.icon} icon={social.icon} label={social.label} />
                ))}
            </div>
        </div>
    </div>
);

export const FooterSeoSection = ({ productStyle = false }) => (
    <div className="mt-10 space-y-4 border-t border-[#e0e0e0] pt-8">
        {SEO_CATEGORIES.map((category) => (
            <p key={category.label} className={`leading-[20px] ${productStyle ? "text-[11px] text-[#757575]" : "text-[11px] text-slate-600"}`}>
                <span className={productStyle ? "font-semibold text-[#212121]" : "font-bold text-slate-800"}>{category.label}:</span>{" "}
                {category.links.map((link, index) => (
                    <span key={link}>
                        <a className="transition hover:text-[#e40046]" href="/">
                            {link}
                        </a>
                        {index < category.links.length - 1 ? " / " : ""}
                    </span>
                ))}
            </p>
        ))}
    </div>
);

export const SiteFooterBottom = ({
    showSubscribe = false,
    showSeo = true,
    className = "",
    embedded = false,
    productStyle = false,
}) => (
    <footer className={`border-t border-snapborder bg-page ${className}`}>
        <div className={embedded ? "py-8" : "mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-12"}>
            <FooterColumnsSection productStyle={productStyle} showSubscribe={showSubscribe} />
            <FooterPaymentSocialSection productStyle={productStyle} />
            {showSeo && <FooterSeoSection productStyle={productStyle} />}
        </div>
    </footer>
);

const HomeFooter = () => (
    <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-12">
            <FooterColumnsSection />
            <FooterPaymentSocialSection />
            <FooterSeoSection />
        </div>
    </footer>
);

export default HomeFooter;
