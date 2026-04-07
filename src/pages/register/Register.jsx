import { useState } from "react";
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
} from "@mui/material";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";


function Register() {
  const [user, setUser] = useState({
    user_name: "",
    user_cpf: "",
    user_email: "",
    user_type: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.postCadastro(user);
      setAlert({
        show: true,
        type: "success",
        message: response.data.message || "Cadastro realizado com sucesso!",
      });

    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao tentar cadastrar",
      });   
     }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3" fontWeight="bold" sx={{ color: "white" }}>
          CADASTRO
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome"
            name="user_name"
            value={user.user_name}
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
            label="CPF"
            name="user_cpf"
            value={user.user_cpf}
            onChange={onChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "white",
              },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                background: "white",
              },
            }}
          >
            <InputLabel>Tipo de Usuário</InputLabel>
            <Select
              name="user_type"
              value={user.user_type}
              label="Tipo de Usuário"
              onChange={onChange}
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="regular">Usuário Regular</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ borderRadius: "10px", mt: 1 }}
          >
            Cadastrar
          </Button>

        </Box>
      </Box>
    </Container>
  );
}

export default Register;
