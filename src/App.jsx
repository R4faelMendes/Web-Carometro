// Import de páginas
import Login from "./pages/login/Login";

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
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;