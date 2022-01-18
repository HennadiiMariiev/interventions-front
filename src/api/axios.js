import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:4000/api",
  baseURL: "https://whispering-wave-44588.herokuapp.com/api",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`;
  return config;
});

export default api;
