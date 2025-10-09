// // /lib/api.ts
// import axios, { AxiosInstance } from "axios";

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v0",

  withCredentials: true,
});

export default api;