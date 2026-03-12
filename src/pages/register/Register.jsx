import { useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  CssBaseline,
  Box,
  Container,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../../axios/axios";
import { Link } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    nome: "",
    senha: "",
    telefone: "",
    cpf: "",
    email: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await api.postCadastro(user)
      alert(response.data.message)
    } catch (error){
      alert(error.response.data.error)

    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Typography component="h1" variant="h5" sx={{color: "white"}}>
            CADASTRO
        </Typography>

        <Box component="form" onSubmit={handleSubmit} >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome"
            name="nome"
            value={user.nome}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="CPF"
            name="cpf"
            value={user.cpf}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Telefone"
            name="telefone"
            value={user.telefone}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            name="senha"
            value={user.senha}
            onChange={onChange}
            sx={{'& .MuiOutlinedInput-root': {borderRadius: '15px', background: "white"}}}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ borderRadius: "10px",mt: 1}}>
            Cadastrar
          </Button>

          <Link to="/register">
            <Typography sx={{color: "white", mt: 1 }}>
              Não tem conta?Cadastre-se
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;