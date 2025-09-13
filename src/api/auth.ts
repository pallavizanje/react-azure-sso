import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Refresh token queue for multiple requests
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

// Interceptor to automatically refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(api(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        window.location.href = "/timeout";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export const loginRequest = async () => {
  const res = await api.get(`/login`);
  return res.data;
};

export const logoutRequest = async () => {
  await api.post(`/logout`);
};

export const getProfile = async () => {
  const res = await api.get(`/me`);
  return res.data;
};
