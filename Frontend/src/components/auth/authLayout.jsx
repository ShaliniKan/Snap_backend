import React from "react";
const AuthLayout =({children, onClose}) => {
    return(<div className = "fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
                <div onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
    );
};

export default AuthLayout;