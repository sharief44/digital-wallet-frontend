import axios from "axios";

const api = axios.create({
 baseURL: "https://digital-wallet-backend-lbdp.onrender.com"
 // your Spring Boot URL
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
