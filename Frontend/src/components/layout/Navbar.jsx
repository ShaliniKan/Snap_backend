import CategoryBar from "./CategoryBar";

const Navbar = ({ onLoginClick }) => {
    return (
        <header className="w-full bg-white shadow-sm">
            <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-12 xl:flex-row xl:items-center">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex h-[32px] w-[148px] items-center justify-center">
                        <img src="/Mainlogo.jpg" alt="ApnaMart" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex items-center gap-3 xl:hidden">
                        <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" onClick={onLoginClick}>Login</button>
                        <button className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white">Cart</button>
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
                    <div className="flex-1">
                        <input
                            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-red-400"
                            type="text"
                            placeholder="Search for brands and products"
                        />
                    </div>

                    <div className="hidden items-center gap-3 xl:flex">
                        <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={onLoginClick}>Login</button>
                        <button className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">My Cart</button>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100">
                <CategoryBar />
            </div>
        </header>
    );
};
 export default Navbar;