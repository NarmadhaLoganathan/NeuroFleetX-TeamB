import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("jwtToken");
    if (stored) {
      const parsed = JSON.parse(stored);
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 40) {
      // Token expired or unauthorized
      localStorage.removeItem("jwtToken");

      toast.error("⏱️ Session expired! Please login again.", {
        position: "top-right",
        autoClose: 4000,
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default api;
