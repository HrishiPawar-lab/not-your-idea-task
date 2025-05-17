import axios from "axios";

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

const HttpClient = async (
    url,
    options = { data: {}, method: "GET", responseType: "json" },
    signal,
    timeout
) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

    const userToken =
        localStorage.getItem("token") && localStorage.getItem("token");

    let fullPath = `${baseUrl}${url}`;

    if (userToken) {
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${userToken}`;
    }

    axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

    if (options.data instanceof FormData) {
        axiosInstance.defaults.headers.common["Content-Type"] =
            "multipart/form-data";
    }

    if (options.isFormEncoded) {
        axiosInstance.defaults.headers.common["Content-Type"] =
            "application/x-www-form-urlencoded";
    }

    return await axiosInstance({
        url: fullPath,
        method: options.method,
        signal,
        data: options.data,
        timeout: timeout ?? 30000,
        responseType: options.responseType,
    })
        .then((response) => {
            if (options.responseType === "blob") {
                return response?.data;
            }
            return {
                data: response?.data?.data,
                message: response?.data?.message,
                status: response?.data?.status,
            };
        })
        .catch((err) => {
            throw err;
        });
};

export default HttpClient;
