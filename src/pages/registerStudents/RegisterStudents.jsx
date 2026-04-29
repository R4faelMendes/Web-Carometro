import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CssBaseline,
  Box,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";
import LayoutBase from "../../components/layoutBase/LayoutBase"; // Se quiser manter o fundo azul/menu

function RegisterStudent() {
  const { classId } = useParams(); // Pega o ID da turma da URL
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    student_name: "",
    student_cpf: "",
    fk_class_id: classId || "", // Preenche automaticamente com o ID da URL
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.postStudent(student);

      setAlert({
        show: true,
        type: "success",
        message: response.data.message,
      });

      setStudent({
        student_name: "",
        student_cpf: "",
        fk_class_id: classId,
      });

      setTimeout(() => navigate(`/class/${classId}`), 2000);

    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao cadastrar aluno",
      });
    }
  };

  return (
    
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
            <IconButton onClick={() => navigate(`/class/${classId}`)} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{ color: "white", flexGrow: 1, textAlign: 'center', mr: 4 }}
            >
              NOVO ALUNO
            </Typography>
          </Box>

          {alert.show && (
            <CustomAlert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ ...alert, show: false })} 
            />
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome Completo do Aluno"
              name="student_name"
              value={student.student_name}
              onChange={onChange}
              autoFocus
              sx={inputStyle}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="CPF"
              name="student_cpf"
              value={student.student_cpf}
              onChange={onChange}
              placeholder="000.000.000-00"
              sx={inputStyle}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              disabled // O ID da turma já vem da página anterior
              label="ID da Turma"
              name="fk_class_id"
              value={student.fk_class_id}
              sx={{
                ...inputStyle,
                "& .MuiOutlinedInput-root": {
                  ...inputStyle["& .MuiOutlinedInput-root"],
                  backgroundColor: "#e0e0e0", // Cor de desativado
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                borderRadius: "20px", 
                mt: 3, 
                mb: 2, 
                height: '50px',
              }}
            >
              Salvar Cadastro
            </Button>
          </Box>
        </Box>
      </Container>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "15px",
    background: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#2957A4",
  }
};

export default RegisterStudent;