import React from "react";
const authLayout =({children}) => {
    return(<div className = "fixed inset-0 bg-black/40 flex items-center justify-center">
                {children}
            </div>
    );
};

export default authLayout;