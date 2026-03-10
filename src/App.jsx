// Import de páginas
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

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
          <Route path="/" element={<Register/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;