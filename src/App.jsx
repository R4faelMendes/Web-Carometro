// Import de páginas
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";

//Import das funções do router
import { 
  BrowserRouter,
  Routes,
  Route
 } from "react-router-dom";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/cadastro" element={<Cadastro/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;