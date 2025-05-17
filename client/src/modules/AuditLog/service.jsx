import { useQuery } from "@tanstack/react-query";
import HttpClient from "../../api/HttpClient";

export const useGetAuditLogs = () => {
    const { data, error, isFetching } = useQuery({
        queryKey: ["tasks"],
        queryFn: () => {
            return HttpClient("api/v1/audit/");
        },
    });

    return {
        data,
        isLoading: isFetching,
        error,
    };
};
