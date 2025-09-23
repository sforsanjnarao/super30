import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v0', // Your backend URL
  withCredentials: true, // IMPORTANT: This allows cookies to be sent
});

export default api;