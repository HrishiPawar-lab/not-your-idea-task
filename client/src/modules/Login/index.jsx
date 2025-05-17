import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Input from ".././../components/FormComponents/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin } from "./service";
import Button from "../../components/GlobalComponents/Button";
import loginImage from "../../assets/images/login.svg";
import { Link } from "react-router-dom";

export const loginSchema = yup.object({
    username: yup
        .string()
        .required("username is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export default function Login() {


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        getValues,
    } = useForm({
        resolver: yupResolver(loginSchema),
        reValidateMode: "onChange",
        defaultValues: { username: "John Doe", password: "John Doe" },
    });

    const { mutate: login } = useLogin();

    const onSubmit = async () => {
        const isValid = await trigger();
        if (!isValid) {
            toast.error("Please fill in all required fields");
            return;
        }
        const { username, password } = getValues();
        login({ username, password });
    };

    return (
        <div className="bg-background-color w-[100vw] h-screen flex items-center justify-center">
            <div className="p-10 flex mx-auto w-8/12 bg-white rounded-3xl shadow-lg  ">
                <div className="w-1/2 flex items-center justify-center">
                    <img src={loginImage} alt="Login" className="object-cover max-w-[350px]  mb-4" />
                </div>
                <div className="w-1/2 flex flex-col  justify-center">
                    <h2 className="mb-6 text-2xl font-bold text-left  text-orange-700">Login</h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4  w-full"
                        noValidate
                    >
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    label="username"
                                    type="username"
                                    placeholder="john doe"
                                    {...field}
                                    error={errors.username?.message}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    error={errors.password?.message}
                                />
                            )}
                        />
                        <p className="text-center text-gray-400">
                            Not a user ?
                            <Link to={'/register'} className="text-orange-500 font-semibold ml-2 underline">
                                Register
                            </Link>
                        </p>
                        <Button onClick={onSubmit}>{isSubmitting ? "Signing in…" : "Sign In"}</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
