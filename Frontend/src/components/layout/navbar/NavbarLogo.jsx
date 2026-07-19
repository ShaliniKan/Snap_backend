const NavbarLogo = ({ variant = "home" }) => {
    const logoSrc = variant === "store" ? "/sdLatestLogo.svg" : "/Mainlogo.jpg";

    if (variant === "store") {
        return (
            <a className="block shrink-0 leading-none" href="/">
                <img alt="ApnaMart" className="block h-8 w-auto" src={logoSrc} />
            </a>
        );
    }

    return (
        <a className="flex h-8 w-[148px] shrink-0 items-center justify-center" href="/">
            <img alt="ApnaMart" className="h-full w-full object-contain" src={logoSrc} />
        </a>
    );
};

export default NavbarLogo;
