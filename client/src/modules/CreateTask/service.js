import HttpClient from "../../api/HttpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTask = ({ resetForm }) => {
  let apiUrl = `api/v1/tasks/`;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (payload) =>
      HttpClient(apiUrl, {
        data: payload,
        method: "POST",
      }),
    onSuccess: async (data) => {
      if (data?.status) {
        toast.success(data?.message || "Task Created Successfully");
        resetForm();
        queryClient.invalidateQueries(["tasks"]);
      } else {
        toast.error(data?.message || "task Creation failed");
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
