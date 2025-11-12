"use client";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401/403 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      // token might be invalid/expired
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
