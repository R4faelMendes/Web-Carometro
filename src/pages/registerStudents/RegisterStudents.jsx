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
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setStudent((prev) => ({
        ...prev,
        student_picture: reader.result, // base64 completo
      }));
    };
    reader.readAsDataURL(file);
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

      // 🔥 só envia imagem se existir
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

      console.log("ENVIANDO:", dataToSend);

      const response = await api.postStudent(dataToSend);

      setAlert({
        show: true,
        type: "success",
        message: response.data.message,
      });

      setStudent({
        student_name: "",
        student_cpf: "",
        fk_class_id: classId,
        student_picture: null,
      });

      setTimeout(() => navigate(`/class/${classId}`), 2000);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.message || "Erro ao cadastrar aluno",
      });
    }
  };

  const getImageSrc = (picture) => {
    if (!picture) return undefined;
    if (picture.startsWith("data:") || picture.startsWith("http")) return picture;
    return `data:image/jpeg;base64,${picture}`;
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "15px",
      background: theme.background,
      color: theme.text,
      "& fieldset": { borderColor: theme.primary },
    },
    "& input": { color: theme.text },
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <IconButton onClick={() => navigate(`/class/${classId}`)}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4">NOVO ALUNO</Typography>

        {alert.show && (
          <CustomAlert {...alert} onClose={() => setAlert({ ...alert, show: false })} />
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          
          <TextField fullWidth label="Nome" name="student_name" value={student.student_name} onChange={onChange} />
          <TextField fullWidth label="CPF" name="student_cpf" value={student.student_cpf} onChange={onChange} />

          <input type="file" accept="image/*" onChange={handleStudentPhotoChange} />

          {student.student_picture && (
            <img src={getImageSrc(student.student_picture)} width={80} />
          )}

          <Button type="submit" fullWidth variant="contained">
            Salvar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterStudent;