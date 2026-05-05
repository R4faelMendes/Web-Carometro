import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  IconButton
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function RegisterCourse() {
  const navigate = useNavigate();
  
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [className, setClassName] = useState("");

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.getUsers();

        const rawUsers = res.data?.data || res.data || [];

        setUsers(
          rawUsers.map((u) => ({
            id: u.user_id ?? u.id,
            name: u.user_name ?? u.name ?? "Sem nome",
          }))
        );
      } catch (err) {
        console.log("ERRO USERS:", err);
      }
    }

    fetchUsers();
  }, []);

  const handleCreateCourse = async () => {
    try {
      if (!courseName.trim()) {
        throw new Error("Nome do curso vazio");
      }

      const res = await api.createCourse({
        course_name: courseName.trim(),
      });

      const id =
        res.data?.data?.course_id ||
        res.data?.course_id ||
        res.data?.id;

      if (!id) throw new Error("course_id não retornado");

      setCourseId(id);
      setOpenModal(true);
      setStep(1);

      setAlert({
        show: true,
        type: "success",
        message: "Curso criado!",
      });
    } catch (err) {
      console.log("ERRO COURSE:", err);

      setAlert({
        show: true,
        type: "error",
        message: err.message || "Erro ao criar curso",
      });
    }
  };

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id]
    );
  };

  const handleAssignUsers = async () => {
    try {
      if (!courseId) throw new Error("courseId inválido");

      if (selectedUsers.length === 0) {
        throw new Error("Selecione pelo menos um usuário");
      }

      await api.assignUsersToCourse(courseId, selectedUsers);

      setStep(2);
    } catch (err) {
      console.log("ERRO ASSIGN:", err);

      setAlert({
        show: true,
        type: "error",
        message: err.message || "Erro ao vincular usuários",
      });
    }
  };

  const handleCreateClass = async () => {
    try {
      if (!courseId) throw new Error("courseId não definido");
      if (!className.trim()) throw new Error("Nome da turma vazio");

      await api.createClass({
        class_name: className.trim(),
        course_id: Number(courseId),
      });

      setAlert({
        show: true,
        type: "success",
        message: "Turma criada!",
      });

      setOpenModal(false);
      setStep(1);
      setCourseName("");
      setClassName("");
      setSelectedUsers([]);
    } catch (err) {
      console.log("ERRO CLASS:", err);

      setAlert({
        show: true,
        type: "error",
        message: err.response?.data?.message || err.message || "Erro ao criar turma",
      });
    }
  };

  return (
    <Container maxWidth="xs">

          <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ display: "flex" }}>

          <IconButton onClick={() => navigate(-1)} sx={{ color: "white",padding:2 }}>
            <ArrowBackIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h3"
            fontWeight="bold"
            sx={{ color: "white" }}
          >
            Criar Curso
          </Typography>
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <TextField
          fullWidth
          label="Digite o nome do curso"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              background: "white",
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, borderRadius: "10px" }}
          onClick={handleCreateCourse}
        >
          Criar
        </Button>
      </Box>

      {/* MODAL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          {step === 1 ? "Relacionar Usuários" : "Criar Turma"}
        </DialogTitle>

        <DialogContent>
          {step === 1 && (
            <Box sx={{ mt: 1 }}>
              {users.map((u) => (
                <Box
                  key={u.id}
                  onClick={() => toggleUser(u.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    mb: 1,
                    background: selectedUsers.includes(u.id)
                      ? "#e3f2fd"
                      : "#f5f5f5",
                  }}
                >
                  <Typography>{u.name}</Typography>
                  <Checkbox checked={selectedUsers.includes(u.id)} />
                </Box>
              ))}
            </Box>
          )}

          {step === 2 && (
            <TextField
              fullWidth
              label="Nome da Turma"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>

        <DialogActions>
          {step === 1 && (
            <Button onClick={handleAssignUsers}>
              Confirmar
            </Button>
          )}

          {step === 2 && (
            <Button onClick={handleCreateClass}>
              Criar Turma
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RegisterCourse;