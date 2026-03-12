// Import de páginas
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import { CssBaseline } from "@mui/material";

//Import das funções do router
import { 
  BrowserRouter,
  Routes,
  Route
 } from "react-router-dom";

function App() {

  return (
    <div>
      <CssBaseline/>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;