import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/carometro",
  headers: {
    accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const sheets = {
  postLogin: (user) => api.post("/auth/login", user),
  postCadastro: (user) => api.post("/user", user),
  getUsers: () => api.get("/user"),

  updateUser: (id, data) => api.put(`/user/${id}`, data),
  deleteUser: (id) => api.delete(`/user/${id}`),
};

export default sheets;