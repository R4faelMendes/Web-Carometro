import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.37:5000/carometro",
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
  resetPassword: (user_id) => api.patch(`/users/${user_id}/reset-password`),

  // COURSE
  createCourse: (data) => api.post("/courses", data),
  assignUsersToCourse: (course_id, user_ids) =>
    api.post(`/courses/${course_id}/users`, { user_ids }),
  getAllCourses: () => api.get("/courses"),        // admin — todos os cursos
  getMyCourses: () => api.get("/courses/me"),      // usuário comum — só os seus
  updateCourse: (course_id, data) => api.patch(`/courses/${course_id}`, data),

  // CLASS (Turmas)
  createClass: (data) => api.post("/classes", data),
  getAllClasses: () => api.get("/classes"),         // admin — todas as turmas
  getMyClasses: () => api.get("/classes/me"),      // usuário comum — só as suas
  getClassesByCourse: (courseId) => api.get(`/classes/course/${courseId}`),
  updateClass: (id, data) => api.patch(`/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/classes/${id}`),

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
  getIncidentsByStudentId: (studentId) => api.get(`/incidents/student/${studentId}`),

  // LOGS
  getAllLogs: () => api.get("/logs"),
  getLogsByTable: (table_name) => api.get(`/logs/table/${table_name}`),

  // HEALTH
  getHealth: () => api.get("/health"),
  getHealthDb: () => api.get("/health/db"),
};

export default apiService;