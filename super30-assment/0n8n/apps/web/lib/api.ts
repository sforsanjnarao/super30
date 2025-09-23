"use client";

import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v0", // backend running port
  withCredentials: true, // important for sending cookies
});

// Add JWT from cookie into headers
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    console.log(config.headers)
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
