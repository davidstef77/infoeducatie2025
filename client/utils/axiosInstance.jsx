import axios from "axios";

const API_BASE_URL =  "https://infoeducatie2025-1.onrender.com/"; // schimbă dacă e nevoie

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Atașează token-ul la fiecare request automat
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("log-in-token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
