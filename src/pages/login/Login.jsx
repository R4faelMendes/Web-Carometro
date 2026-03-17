import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
} from "@mui/material";
import api from "../../axios/axios"
import { Link, } from "react-router-dom";
import { Password } from "@mui/icons-material";
import logo from "../../assets/logo.png"

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });


  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({...user, [name]: value });
    console.log(user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await api.postLogin(user)
      alert("O servidor disse: " + response.data.message)
    } catch (error){
      alert("Erro: " + error.response)
      
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      
    <Box
      sx={{
        position: "absolute",
        top: 20,
        right: 20,
      }}
    >
      <img src={logo} alt="logo" width={80} />
    </Box>


      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography 
        component="h1" 
        variant="h3"
        fontWeight="bold"
        sx={{color: "white"}}>
        LOGIN
        </Typography>
        <Box
          component="form"
          sx={{ mt: 2}}
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            id="user_email"
            name="user_email"
            value={user.user_email}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            id="user_password"
            name="user_password"
            value={user.user_password}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}

          />
          
          <div style={{ display: "flex", justifyContent: "center"}}>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "10px"}}
              onClick={() => navigate("/")}
>
              ENTRAR
            </Button>
          </div>
          <div>
               <Link to="/register">
            <Typography sx={{color: "white", mt: 2, }}>
              Não tem conta?Cadastre-se
            </Typography>
             </Link>
          </div>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;