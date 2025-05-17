import { useNavigate } from "react-router-dom";
import HttpClient from "../../api/HttpClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLogin = () => {
    const navigate = useNavigate();

    let apiUrl = `api/v1/auth/login`;

    const { mutate, isSuccess } = useMutation({
        mutationFn: (payload) =>
            HttpClient(apiUrl, {
                data: payload,
                method: "POST",
            }),
        onSuccess: async (data) => {
            if (data?.status) {
                console.log("Login successful");
                localStorage.setItem("token", data?.data?.token);
                localStorage.setItem("user", JSON.stringify(data?.data?.role));
                toast.success("Login successful");
                navigate("/", { replace: true });
        } else {
                toast.error(data?.message || "Login failed");
            }
        },
        onError: () => {
            toast.error("Some error occurred.");
        },
    });

    return {
        mutate,
        isSuccess,
    }
}
