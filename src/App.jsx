import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/protectedRouted/ProtectedRoute";
import Menu from "./pages/menu/Menu";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/listUsers/ListUsers";
import ListClass from "./pages/listClass/ListClass";
import RegisterCourse from "./pages/registerCourse/RegisterCourse";
import StudentsList from "./pages/listStudents/ListStudents";
import RegisterStudent from "./pages/registerStudents/RegisterStudents";
import Incidents from "./pages/listIncidents/ListIncidents";
import Student from "./pages/Students/Student";

import { ThemeProvider } from "./components/colors/Colors";

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listusers"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listclass"
            element={
              <ProtectedRoute>
                <ListClass />
              </ProtectedRoute>
            }
          />

          <Route
            path="/registercourses"
            element={
              <ProtectedRoute>
                <RegisterCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/class/:classId"
            element={
              <ProtectedRoute>
                <StudentsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/registerstudent/:classId"
            element={
              <ProtectedRoute>
                <RegisterStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents"
            element={
              <ProtectedRoute>
                <Incidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/:studentId"
            element={
              <ProtectedRoute>
                <Student />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;