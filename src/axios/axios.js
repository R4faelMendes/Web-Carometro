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
  getUsers: () => api.get("/users/"),
  postCadastro: (user) => api.post("/users/", user),
  updateUser: (user_id, data) => api.patch(`/users/${user_id}`, data),
  deleteUser: (user_id) => api.delete(`/users/${user_id}`),
  updatePassword: (data) => api.patch("/users/me/password", data),
  // CORREÇÃO: faltava "/" antes de user_id
  resetPassword: (user_id) => api.patch(`/users/${user_id}/reset-password`),

  // COURSE
  createCourse: (data) => api.post("/courses", data),
  // CORREÇÃO: rota correta do backend é /:course_id/users, não /assign-users
  assignUsersToCourse: (course_id, user_ids) =>
    api.post(`/courses/${course_id}/users`, { user_ids }),
  getAllCourses: () => api.get("/courses/me"),
  updateCourse: (course_id, data) => api.patch(`/courses/${course_id}`, data),

  // CLASS (Turmas)
  createClass: (data) => api.post("/classes/", data),
  // CORREÇÃO: rota /classes (sem /me) é admin only — rota correta para usuário comum é /classes/me
  getClassesByUser: () => api.get("/classes/me"),
  getClassesByCourse: (courseId) => api.get(`/classes/course/${courseId}`),
  updateClass: (id, data) => api.patch(`/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/classes/${id}`),
  getAllClasses: () => api.get("/classes/me"),

  // STUDENTS
  getStudentsByClass: (classId) => api.get(`/students/class/${classId}`),
  postStudent: (data) => api.post("/students", data),
  readAllStudents: () => api.get("/students"),
  updateStudent: (id, data) => api.patch(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),

  // INCIDENTS
  getAllIncidents: () => api.get("/incidents"),
  createIncident: (data) => api.post("/incidents", data),
  updateIncident: (id, data) => api.patch(`/incidents/${id}`, data),
  deleteIncident: (id) => api.delete(`/incidents/${id}`),
  // CORREÇÃO: rota correta é /incidents/student/:student_id, não /incidents/:student_id
  getIncidentsByStudentId: (studentId) => api.get(`/incidents/student/${studentId}`),

  // LOGS
  getAllLogs: () => api.get("/logs"),
  getLogsByTable: (table_name) => api.get(`/logs/table/${table_name}`),

  // HEALTH
  getHealth: () => api.get("/health"),
  getHealthDb: () => api.get("/health/db"),
};

export default apiService;