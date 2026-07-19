import NavbarActions from "./NavbarActions";

const MobileMenu = ({ isOpen, isLoggedIn, onLoginClick }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
            <div className="mb-4">
                <NavbarActions isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
            </div>
        </div>
    );
};

export default MobileMenu;
