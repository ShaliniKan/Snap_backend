const Footer = ({ variant = "customer" }) => {
    const footerTitle = variant === "vendor" ? "Vendor Footer" : "Customer Footer";

    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
                <p className="font-semibold text-slate-900">{footerTitle}</p>
                <p>Footer links and support content will be added here.</p>
            </div>
        </footer>
    );
};

export default Footer;
