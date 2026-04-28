// Import de páginas
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/protectedRouted/ProtectedRoute";
import Menu from "./pages/menu/Menu";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/listUsers/ListUsers";
import Turmas from "./pages/listClass/ListClass";
import RegisterCourse from "./pages/registerCourse/RegisterCourse";
import StudentsList from "./pages/class/Class";
import RegisterStudent from "./pages/registerStudents/RegisterStudents";

function App() {
  return (
    <div>
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
                <Turmas />
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
          <Route path="/class/:classId" element={<ProtectedRoute><StudentsList /></ProtectedRoute>} />
          <Route path="/registerstudent/:classId" element={<ProtectedRoute><RegisterStudent /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>


    </div>

  );
}

export default App;
