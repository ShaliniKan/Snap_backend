const FormInput = ({ label, ...inputProps }) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
            <input
                {...inputProps}
                className="h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-red-400"
            />
        </div>
    );
};

export default FormInput;
