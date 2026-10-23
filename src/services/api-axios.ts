
import axios from "axios";

let activeRequests = 0;
let loadingListeners: ((loading: boolean) => void)[] = [];

const notifyLoading = () => {
  const loading = activeRequests > 0;
  loadingListeners.forEach((listener) => listener(loading));
};

export const subscribeToLoading = (
  listener: (loading: boolean) => void,
) => {
  loadingListeners.push(listener);
  listener(activeRequests > 0);

  return () => {
    loadingListeners = loadingListeners.filter((item) => item !== listener);
  };
};

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiAxios.interceptors.request.use(
  (config) => {
    activeRequests++;
    notifyLoading();
    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    notifyLoading();
    return Promise.reject(error);
  },
);

apiAxios.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    notifyLoading();
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    notifyLoading();

    if (error.response?.status === 401) {
      const url = error.config?.url ?? "";

      if (!url.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiAxios;
