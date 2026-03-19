import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../axios/axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    user_email: "",
    user_password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.postLogin(user)
      alert("O servidor: disse " + response.data.message)
    localStorage.setItem("auth","true")
    return navigate("/poshome");
    } catch (error) {
      alert("Erro: " + error.response?.data?.message)
    }

  };

  return (
    <Container component="main" maxWidth="xs">

      {/* Logo */}
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
          sx={{ color: "white" }}
        >
          LOGIN
        </Typography>

        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} noValidate>

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="user_email"
            value={user.user_email}
            onChange={onChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                background: "white"
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type={showPassword ? "text" : "password"}
            name="user_password"
            value={user.user_password}
            onChange={onChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                background: "white"
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ borderRadius: "10px", height: 45 }}
            >
              ENTRAR
            </Button>
          </Box>

          <Link to="/register" style={{ textDecoration: "none" }}>
            <Typography sx={{ color: "white", mt: 2, textAlign: "center" }}>
              Não tem conta? Cadastre-se
            </Typography>
          </Link>

        </Box>
      </Box>
    </Container>
  );
}

export default Login;