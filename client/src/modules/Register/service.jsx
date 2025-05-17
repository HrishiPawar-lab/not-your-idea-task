import { useNavigate } from "react-router-dom";
import HttpClient from "../../api/HttpClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRegister = () => {
    const navigate = useNavigate();
    const apiUrl = "api/v1/auth/register";

    const { mutate, isLoading } = useMutation({
        mutationFn: (payload) =>
            HttpClient(apiUrl, {
                data: payload,
                method: "POST",
            }),
        onSuccess: (response) => {
            if (response?.status) {
                toast.success("Registration successful");
                navigate("/login", { replace: true });
            } else {
                toast.error(response.message || "Registration failed");
            }
        },
        onError: () => {
            toast.error("Unexpected error occurred");
        },
    });

    return { mutate, isLoading };
};
