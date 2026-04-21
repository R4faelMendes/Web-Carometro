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

function App() {
  return (
    <div>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
