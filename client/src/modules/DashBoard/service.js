import { useQuery } from "@tanstack/react-query";
import HttpClient from "../../api/HttpClient";
import { useMemo } from "react";

export const useGetTasks = ({ setTasksByStatus }) => {
  const { data, error, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => {
      return HttpClient("api/v1/tasks");
    },
  });

  useMemo(() => {
    if (data?.status) {
      const tasks = data?.data;
      const tasksByPriority = {
        "To Do": [],
        "In Progress": [],
        Done: [],
      };

      Array.isArray(tasks) &&
        tasks?.forEach((task) => {
          if (task.status === "To Do") {
            tasksByPriority["To Do"].push(task);
          } else if (task.status === "In Progress") {
            tasksByPriority["In Progress"].push(task);
          } else if (task.status === "Done") {
            tasksByPriority.Done.push(task);
          }
        });

      setTasksByStatus(tasksByPriority);
    }
  }, [JSON.stringify(data)]);

  return {
    data,
    isLoading: isFetching,
    error,
  };
};
