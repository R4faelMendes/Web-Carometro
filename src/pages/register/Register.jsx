import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CssBaseline,
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";
import { useTheme } from "../../components/colors/Colors";

function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [user, setUser] = useState({
    user_name: "",
    user_cpf: "",
    user_email: "",
    user_type: "",
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.postCadastro(user);
      setAlert({ show: true, type: "success", message: response.data.message });
      setUser({ user_name: "", user_cpf: "", user_email: "", user_type: "" });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao tentar cadastrar usuário",
      });
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "15px",
      background: theme.background,
      color: theme.text,
      "& fieldset": { borderColor: theme.primary },
      "&:hover fieldset": { borderColor: theme.secondary },
      "&.Mui-focused fieldset": { borderColor: theme.focus },
    },
    "& .MuiInputLabel-root": { color: theme.text, opacity: 0.7 },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.primary },
    "& input": { color: theme.text },
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: theme.registerT, padding: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h3" fontWeight="bold" sx={{ color: theme.registerT }}>
            CADASTRO
          </Typography>
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome"
            name="user_name"
            value={user.user_name}
            onChange={onChange}
            sx={inputStyle}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="user_email"
            value={user.user_email}
            onChange={onChange}
            sx={inputStyle}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="CPF"
            name="user_cpf"
            value={user.user_cpf}
            onChange={onChange}
            sx={inputStyle}
          />

          <FormControl
            fullWidth
            margin="normal"
            required
            sx={{
              ...inputStyle,
              "& .MuiSelect-select": { color: theme.text },
              "& .MuiSvgIcon-root": { color: theme.text },
            }}
          >
            <InputLabel sx={{ color: theme.text, opacity: 0.7, "&.Mui-focused": { color: theme.primary } }}>
              Tipo de Usuário
            </InputLabel>
            <Select
              name="user_type"
              value={user.user_type}
              label="Tipo de Usuário"
              onChange={onChange}
              sx={{
                borderRadius: "15px",
                background: theme.background,
                color: theme.text,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.primary },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.focus },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: theme.background,
                    color: theme.text,
                    "& .MuiMenuItem-root:hover": { background: theme.contrast },
                    "& .MuiMenuItem-root.Mui-selected": {
                      background: theme.primary + "33",
                    },
                  },
                },
              }}
            >
              <MenuItem value="admin" sx={{ color: theme.text }}>Administrador</MenuItem>
              <MenuItem value="regular" sx={{ color: theme.text }}>Usuário Regular</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "10px",
              mt: 2,
              height: "50px",
              backgroundColor: theme.primary,
              color: theme.background,
              fontWeight: "bold",
              "&:hover": { backgroundColor: theme.secondary },
            }}
          >
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;