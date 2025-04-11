//original without authorization
/* import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:7700/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance; */

// automatically authorization when we request and response

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7700/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and 403 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // If unauthorized (token expired/invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return Promise.reject(error);
    }

    // If forbidden (admin access required)
    if (error.response?.status === 403) {
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return Promise.reject(error);
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
