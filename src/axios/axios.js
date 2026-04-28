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
  assignUsersToCourse: (course_id, user_ids) =>api.post(`/course/${course_id}/assign-users`, { user_ids }),
  
  getAllCourses: () => api.get("/course/all"), // Para Admin ver tudo
  getCourses: () => api.get("/course"),         // Para Usuário ver os seus

  // CLASS (Turmas)
  createClass: (data) => api.post("/class", data),
  getClassesByCourse: (courseId) => api.get(`/class/${courseId}`),
  updateClass: (id, data) => api.put(`/class/${id}`, data),
  deleteClass: (id) => api.delete(`/class/${id}`),

  // ALUNOS (Importante para o Carômetro carregar)
  getStudentsByClass: (classId) => api.get(`/class/${classId}/students`),

  
};

export default apiService;