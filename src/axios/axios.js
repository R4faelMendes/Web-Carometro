import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.83:5000/carometro",
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
  updatePassword: (data) => api.patch("/password/user", data),
  resetPassword: (id) => api.patch(`/user/reset-password/${id}`),


  // COURSE
  createCourse: (data) => api.post("/course", data),
  assignUsersToCourse: (course_id, user_ids) => api.post(`/course/${course_id}/assign-users`, { user_ids }),
  getAllCourses: () => api.get("/course/all"),
  updateCourse: (id, data) => api.patch(`/course/${id}`, data),
  
  // CLASS (Turmas)
  createClass: (data) => api.post("/class", data),
  getClassesByUser: () => api.get("/class"),
  getClassesByCourse: (courseId) => api.get(`/class/${courseId}`),
  updateClass: (id, data) => api.patch(`/class/${id}`, data),
  deleteClass: (id) => api.delete(`/class/${id}`),
  getAllClasses: () => api.get("/class/all"),

  // STUDENTS
  getStudentsByClass: (classId) => api.get(`/student/${classId}`),
  postStudent: (data) => api.post("/student", data),
  readAllStudents: () => api.get("/student"),
  updateStudent: (id, data) => api.patch(`/student/${id}`, data),
  deleteStudent: (id) => api.delete(`/student/${id}`),

  // INCIDENTS
  getAllIncidents: () => api.get("/incident"),
  createIncident: (data) => api.post("/incident", data),
  updateIncident: (id, data) => api.patch(`/incident/${id}`, data),
  deleteIncident: (id) => api.delete(`/incident/${id}`),
  getIncidentsByStudentId: (studentId) => api.get(`/incident/${studentId}`),

  //LOGS
  getAllLogs: () => api.get("/log"),


};

export default apiService;

