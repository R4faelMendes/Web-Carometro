import { useState } from "react";
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
import { useTheme } from "../../components/colors/Colors";

function RegisterStudent() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [student, setStudent] = useState({
    student_name: "",
    student_cpf: "",
    fk_class_id: classId || "",
    student_picture: null,
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleStudentPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent((prev) => ({ ...prev, student_picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const dataToSend = {
      student_name: student.student_name,
      student_cpf: student.student_cpf,
      fk_class_id: student.fk_class_id,
    };

    if (
      student.student_picture &&
      typeof student.student_picture === "string" &&
      student.student_picture.startsWith("data:image")
    ) {
      dataToSend.student_picture = student.student_picture.replace(
        /^data:image\/[^;]+;base64,/,
        ""
      );
    }

    const response = await api.postStudent(dataToSend);

    setAlert({ show: true, type: "success", message: response.data.message });
    setStudent({ student_name: "", student_cpf: "", fk_class_id: classId, student_picture: null });
    setTimeout(() => navigate(`/class/${classId}`), 2000);

  } catch (error) {
    setAlert({
      show: true,
      type: "error",
      message: error.response?.data?.message || "Erro ao cadastrar aluno",
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
    "& .MuiInputLabel-root.Mui-focused": { color: theme.labelRegister },
    "& input": { color: theme.text },
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 2 }}>
          <IconButton onClick={() => navigate(`/class/${classId}`)} sx={{ color: theme.registerT }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ color: theme.registerT, flexGrow: 1, textAlign: "center", mr: 4 }}
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
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
            disabled
            label="ID da Turma"
            name="fk_class_id"
            value={student.fk_class_id}
            sx={{
              ...inputStyle,
              "& .MuiOutlinedInput-root": {
                ...inputStyle["& .MuiOutlinedInput-root"],
                background: theme.contrast,
                opacity: 0.7,
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: theme.text,
                opacity: 0.5,
              },
            }}
          />

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <input
              accept="image/*"
              type="file"
              id="upload-student-photo"
              style={{ display: "none" }}
              onChange={handleStudentPhotoChange}
            />
            <label htmlFor="upload-student-photo" style={{ width: "100%" }}>
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{
                  borderRadius: "15px",
                  border: `2px dashed ${theme.primary}`,
                  color: theme.primary,
                  fontWeight: "bold",
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    border: `2px dashed ${theme.secondary}`,
                    backgroundColor: `${theme.primary}`
                  }
                }}
              >
                {student.student_picture ? "Alterar Foto do Aluno" : "Adicionar Foto do Aluno"}
              </Button>
            </label>
            {student.student_picture && (
              <Box
                component="img"
                src={student.student_picture}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${theme.primary}`,
                  mt: 1
                }}
              />
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "20px",
              mt: 3,
              mb: 2,
              height: "50px",
              backgroundColor: theme.primary,
              color: theme.background,
              fontWeight: "bold",
              "&:hover": { backgroundColor: theme.secondary },
            }}
          >
            Salvar Cadastro
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterStudent;