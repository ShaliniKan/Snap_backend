import AuthLayout from "../../components/auth/authLayout";
import FormAlert from "../../components/common/FormAlert";
import FormInput from "../../components/common/FormInput";

const Register = ({
    onClose,
    onSwitchToLogin,
    onSubmit,
    formData,
    onChange,
    isSubmitting,
    error,
    message,
    title = "Sign up",
    subtitle = "Create account",
    submitLabel = "Create account",
}) => {
    return (
        <AuthLayout onClose={onClose}>
            <div className="w-[92vw] max-w-[430px] rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">{subtitle}</p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <FormAlert>{error}</FormAlert>
                    <FormAlert variant="success">{message}</FormAlert>

                    <FormInput
                        label="Full name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Enter your full name"
                        required
                    />

                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="Enter your email"
                        required
                    />

                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        placeholder="Create a password"
                        required
                    />

                    <button type="submit" className="h-11 w-full rounded-lg bg-red-500 font-semibold text-white transition hover:bg-red-600" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : submitLabel}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-600">
                    Already have an account?{' '}
                    <button type="button" className="font-semibold text-red-500" onClick={onSwitchToLogin}>
                        Login
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;
