import { Link } from "react-router-dom";

import { useCartContext } from "../../../context/CartContext";

import { useAuth } from "../../../context/AuthContext";

import { ROUTES, USER_ROLES } from "../../../routes/routePaths";



const NavbarActions = () => {

    const { openCart, totalItems } = useCartContext();

    const { isAuthenticated, user, openLogin } = useAuth();



    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Profile";



    const profilePath =

        user?.role === USER_ROLES.vendor

            ? ROUTES.vendor.profile

            : user?.role === USER_ROLES.admin

            ? ROUTES.admin.dashboard

              : ROUTES.customer.profile;



    return (

        <div className="flex items-center gap-2">

            {isAuthenticated ? (

                <Link

                    to={profilePath}

                    className="rounded-sm px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"

                >

                    {displayName}

                </Link>

            ) : (

                <button

                    className="rounded-sm px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"

                    onClick={openLogin}

                    type="button"

                >

                    Login

                </button>

            )}

            {user?.role !== USER_ROLES.vendor && user?.role !== USER_ROLES.admin && (

                <button

                    className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"

                    onClick={openCart}

                    type="button"

                >

                    My Cart{totalItems > 0 ? ` (${totalItems})` : ""}

                </button>

            )}

        </div>

    );

};



export default NavbarActions;

