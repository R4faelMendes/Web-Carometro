import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    user_email: "",
    user_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.postLogin(user);

      setAlert({
        show: true,
        type: "success",
        message: response.data.message || "Login realizado com sucesso!",
      });

      localStorage.setItem("auth", "true");

      setTimeout(() => {
        navigate("/menu");
      }, 1500);

    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao fazer login",
      });
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
          sx={{ color: "white" }}
        >
          LOGIN
        </Typography>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

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
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "white",
              },
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "white",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
        </Box>
      </Box>
    </Container>
  );
}

export default Login;