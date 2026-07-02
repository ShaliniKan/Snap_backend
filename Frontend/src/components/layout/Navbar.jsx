import CategoryBar from "./CategoryBar";

const Navbar = ({onLoginClick}) => {
    return(
        <header className="flex flex-col w-full min-w-[1024px] bg-white shadow-md" name="TopHeaderWrapper">
            
            <div  className="flex items-center w-full px-12 py-3">
                {/* Logo*/}
                <div className="flex w-[148px] h-[31.08px] justify-center items-center">
                    <img src="/Mainlogo.jpg" alt="Snapdeal" className="w-full h-full object-contain"/></div>
                {/*Right Section*/}
                <div className="flex flex-1 items-center">
                    {/*Search*/}
                    <div className="flex-1 mx-8">
                        <input className="w-full h-10 px-3 rounded border border-gray-300 bg-gray-100" 
                            type="text" placeholder="Search for Brand & Product"/>
                    </div>
                    {/* Login*/}
                    <div className="flex w-[65px] flex-col items-center gap-[3px] cursor-pointer">
                        <span className="text-ellipsis w-[80px] text-[rgb(102,102,102)] text-center text-base not-italic font-bold leading-snug tracking-tight">
                        <button onClick={onLoginClick}> Login </button>
                        </span>   
                    </div>
                    {/* Cart */}
                    <div className="flex w-[65px] flex-col items-center gap-[3px] cursor-pointer">
                        <span className="text-ellipsis w-[80px] text-[rgb(102,102,102)] text-center text-base not-italic font-bold leading-snug tracking-tight">
                            My Cart
                        </span>
                    </div>
                </div>
            </div>
            <div className="bg-white self-stretch items-center pt-0 px-12 pb-[6px]"></div>
            <div className="flex-1 ">
            {/*Categories*/}
                <CategoryBar/>
            </div>
        </header>
    );
};
 export default Navbar;