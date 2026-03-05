import { useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  CssBaseline,
  Box,
  Container,
  Typography,
} from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import api from "../../axios/axios"
import { Link, } from "react-router-dom";
import { Password } from "@mui/icons-material";


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
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography 
        component="h1" 
        variant="h5"
        sx={{color: "white"}}>
        LOGIN
        </Typography>
        <Box
          component="form"
          sx={{ mt: 3}}
          onSubmit={handleSubmit}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            id="email"
            name="Email"
            value={user.email}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            id="password"
            name="Senha"
            value={user.password}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}

          />
          <div sx={{justifyContent: "center"}}>
          <Button type="submit" variant="contained" sx={{alignItems:"center", borderRadius: "10px"}}>
            ENTRAR
          </Button>
          </div>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;