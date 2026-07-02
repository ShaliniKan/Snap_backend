import AuthLayout from "../../components/auth/authLayout";

const Login =({onClose}) =>{
    return(
        <AuthLayout onClose={onClose}>
            <div className="bg-white w-[430px] rounded-xl shadow-2xl p-8">

            <h1 className="text-3xl font-semibold">
                 Login
            </h1>

            </div>
        </AuthLayout>
    );
};

export default Login;