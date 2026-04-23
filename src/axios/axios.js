import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/carometro",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token; 
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const sheets = {
  // AUTH
  postLogin: (user) => api.post("/auth/login", user),

  // USERS
  getUsers: () => api.get("/user"),

  postCadastro: (user) => api.post("/user", user),

  updateUser: (id, data) =>
    api.patch(`/user/${id}`, data),

  deleteUser: (id) =>
    api.delete(`/user/${id}`), 

  // PASSWORD
  updatePassword: (data) =>
    api.patch("/password/user", data),
};

export default sheets;