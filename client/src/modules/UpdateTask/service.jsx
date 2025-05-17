import { useQuery, useMutation } from "@tanstack/react-query";
import HttpClient from "../../api/HttpClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const useGetTaskById = ({ id, setValue }) => {
    const { data, error, isFetching, isSuccess } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const response = await HttpClient(`api/v1/tasks/${id}`);
            setValue("title", response?.data.title);
            setValue("description", response?.data.description);
            setValue("status", response?.data.status);
            setValue("priority", response?.data.priority);
            if (data.dueDate) {
                setValue("dueDate", new Date(response?.data.dueDate));
            }

            return response
        },
    });


    return {
        data,
        isLoading: isFetching,
        error,
    };
};

export const useUpdateTask = ({ id, resetForm }) => {
    let apiUrl = `api/v1/tasks/${id}`;

    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: (payload) =>
            HttpClient(apiUrl, {
                data: payload,
                method: "PUT",
            }),
        onSuccess: async (data) => {
            if (data?.status) {
                toast.success(data?.message || "Task Updated Successfully");
                resetForm()
                navigate(-1)
            } else {
                toast.error(data?.message || "task Updating failed");
            }
        },
        onError: (err) => {
            console.log(err);
            toast.error("Some error occurred.");
        },
    });

    return {
        mutate,
    };


};
