const stateStyles = {
    default: "border-slate-200 bg-white text-slate-600",
    error: "border-red-200 bg-red-50 text-red-600",
};

const SectionState = ({ children, variant = "default" }) => {
    return (
        <div className={`rounded-sm border p-8 text-center text-sm font-medium ${stateStyles[variant]}`}>
            {children}
        </div>
    );
};

export default SectionState;
