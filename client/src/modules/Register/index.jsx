import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/FormComponents/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/GlobalComponents/Button";
import { useRegister } from "./service";
import registerImage from "../../assets/images/register.svg";

export const registerSchema = yup.object({
    username: yup
        .string()
        .required("username is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export default function Register() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        getValues,
    } = useForm({
        resolver: yupResolver(registerSchema),
        reValidateMode: "onChange",
        defaultValues: { username: "", password: "" },
    });

    const { mutate } = useRegister();

    const onSubmit = async () => {
        const valid = await trigger();
        if (!valid) {
            toast.error("Please fix the errors in the form");
            return;
        }
        const { username, password } = getValues();
        mutate({ username, password });
    };

    return (
        <div className="bg-background-color w-[100vw] h-screen flex items-center justify-center">
            <div className="flex p-6 mx-auto bg-white rounded-xl shadow-lg max-w-4xl items-center w-full">
                <div className="w-1/2 pr-6 hidden md:block">
                    <img
                        src={registerImage}
                        alt="Register"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <h2 className="mb-6 text-2xl font-bold  text-orange-600 ">Register</h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
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

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up…" : "Sign Up"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
