const alertStyles = {
    error: "border-red-200 bg-red-50 text-red-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-600",
};

const FormAlert = ({ children, variant = "error" }) => {
    if (!children) {
        return null;
    }

    return (
        <p className={`rounded-lg border px-3 py-2 text-sm ${alertStyles[variant]}`}>
            {children}
        </p>
    );
};

export default FormAlert;
