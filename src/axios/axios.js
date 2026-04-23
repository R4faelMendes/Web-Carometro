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
  (error) => {
    return Promise.reject(error);
  }
);

const sheets = {
  postLogin: (user) => api.post("/auth/login", user),
  postCadastro: (user) => api.post("/user", user),
  getUsers: () => api.get("/user"),
  updatePassword: (data) => api.patch("/password/user", data),
};

export default sheets;