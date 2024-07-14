import axios from "axios";

const api = axios.create({ baseURL: " http://127.0.0.1:8000/" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post("token/", data);
export const register = (data) => api.post("users/", data);
export const getTodos = () => api.post("tasks/");
export const createTodo = (data) => api.post("tasks/", data);
export const updateTodo = (id, data) => api.put(`tasks/?pk=${id}`, data);
export const deleteTodo = (id) => api.delete(`tasks/?pk=${id}`);

export default api;
