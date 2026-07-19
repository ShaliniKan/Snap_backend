import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";

const NotFound = () => {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="text-[48px] font-normal text-[#333333]">404</h1>
            <p className="mt-3 text-[16px] text-[#666666]">The page you are looking for could not be found.</p>
            <Link
                to={ROUTES.public.home}
                className="mt-8 bg-[#e40046] px-8 py-3 text-[13px] uppercase tracking-wide text-white transition hover:bg-[#c9003c]"
            >
                Go To Home
            </Link>
        </div>
    );
};

export default NotFound;
