import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showModalNewPassword, setShowModalNewPassword] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [openChangePassword, setOpenChangePassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    password: "",
    user_password: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.postLogin(user);

      const apiUser = response.data.data;
      const token = response.data.token;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: apiUser.user_name,
          user_type: apiUser.user_type,
        }),
      );

      if (apiUser.first_login) {
        setOpenChangePassword(true);
        return;
      }

      setAlert({
        show: true,
        type: "success",
        message: response.data.message || "Login realizado com sucesso!",
      });

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

  const handleChangePassword = async () => {
    try {
      await api.updatePassword({
        user_password: passwordData.user_password,
        password: passwordData.password,
      });

      setOpenChangePassword(false);

      setAlert({
        show: true,
        type: "success",
        message: "Senha atualizada com sucesso!",
      });

      setTimeout(() => {
        navigate("/menu");
      }, 1500);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao atualizar senha",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
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
        <Typography variant="h3" fontWeight="bold" sx={{ color: "white" }}>
          LOGIN
        </Typography>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              borderRadius: "10px",
              backgroundColor: "#2957A4",
            }}
          >
            ENTRAR
          </Button>
        </Box>
      </Box>

      <Dialog open={openChangePassword}>
        <DialogTitle>Primeiro acesso</DialogTitle>

        <DialogContent>
          <TextField
            label="Senha atual"
            type={showModalPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                password: e.target.value,
              })
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "white",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowModalPassword(!showModalPassword)}
                  >
                    {showModalPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Nova senha"
            type={showModalNewPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                user_password: e.target.value,
              })
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "white",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowModalNewPassword(!showModalNewPassword)
                    }
                  >
                    {showModalNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleChangePassword}>Atualizar senha</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Login;
