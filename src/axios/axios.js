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

const apiService = {
  // AUTH
  postLogin: (user) => api.post("/auth/login", user),

  // USERS
  getUsers: () => api.get("/user"),
  postCadastro: (user) => api.post("/user", user),
  updateUser: (id, data) => api.patch(`/user/${id}`, data),
  deleteUser: (id) => api.delete(`/user/${id}`),

  // PASSWORD
  updatePassword: (data) => api.patch("/password/user", data),

  // COURSE
  createCourse: (data) => api.post("/course", data),
  assignUsersToCourse: (course_id, user_ids) => api.post(`/course/${course_id}/assign-users`, { user_ids }),
  getAllCourses: () => api.get("/course/all"),
  getCourses: () => api.get("/course"),
  updateCourse: (id, data) => api.patch(`/course/${id}`, data), // Rota para atualizar o curso


  // CLASS (Turmas)
  createClass: (data) => api.post("/class", data),
  getClassesByUser: () => api.get("/class"), // ROTA CORRETA PARA PEGAR TURMAS DO USUÁRIO
  getClassesByCourse: (courseId) => api.get(`/class/${courseId}`),
  updateClass: (id, data) => api.patch(`/class/${id}`, data), // Back-end usa PATCH
  deleteClass: (id) => api.delete(`/class/${id}`),
  getAllClasses: () => api.get("/class/all"),
  
  // ALUNOS
  getStudentsByClass: (classId) => api.get(`/student/${classId}`),
};

export default apiService;