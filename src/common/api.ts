import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";

export const URL:string = import.meta.env.VITE_API_GATEWAY_URL;

const appInstance = axios.create({
    baseURL: URL,
    withCredentials: true
});

// Response Interceptor: Automatically extracts `data` from response
appInstance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
        console.error("Request failed:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const commonRequest = async <T, B = unknown>(
    method: Method,
    route: string,
    body?: B,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        method,
        url: route,
        data: body,
        headers: config.headers,
        withCredentials: true
    };

    try {
        return await appInstance(requestConfig);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("Error response:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};
