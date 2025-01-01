import axios from "axios";
import { useWebStore } from "../store/authStore";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add request interceptor
API.interceptors.request.use(
    (config) => {
        console.log("Request sent.........");
        const { accessToken } = useWebStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Response error.........", error);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Access token expired.........");
      originalRequest._retry = true;
      const { refreshToken } = useWebStore.getState();

      if (!refreshToken) {
        console.error("No refresh token available");
        useWebStore.getState().clearAuth(); 
        return Promise.reject(error);
      }

      try {
        console.log("Refreshing access token.........");
        const refreshResponse = await API.post("/auth/token/refresh/", {
          refresh_token: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        console.log("New access token:", newAccessToken);
        console.log("New refresh token:", newRefreshToken);
        useWebStore.getState().setAccessToken(newAccessToken);
        useWebStore.getState().setRefreshToken(newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("Retrying request with new access token.........");
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        useWebStore.getState().clearAuth(); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
