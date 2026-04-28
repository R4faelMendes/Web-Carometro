import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from "@mui/material";
import { Edit, Delete, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Turmas() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const getClassId = (cls) =>
    cls?.class_id || cls?.id || cls?.classId || cls?.id_class || null;

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);

      const courseId = 1; // ⚠️ confirme se esse ID existe no banco

      const response = await api.getClassesByCourse(courseId);

      console.log("🔥 RAW RESPONSE:", response);
      console.log("🔥 RESPONSE.DATA:", response.data);

      // ✅ CORREÇÃO REAL AQUI
      const rawData = response.data;

      const classesArray = Array.isArray(rawData)
        ? rawData
        : rawData?.data ?? [];

      console.log("🔥 CLASSES ARRAY FINAL:", classesArray);

      if (!Array.isArray(classesArray)) {
        throw new Error("API não retornou array válido");
      }

      const formatted = classesArray.map((item) => ({
        class_id: item.class_id || item.id || item.id_class,
        class_name: item.class_name || item.name || "Sem nome",
        course_name:
          item.course_name ||
          item.course?.course_name ||
          item.course?.name ||
          "Curso",
      }));

      setClasses(formatted);

    } catch (error) {
      console.log("❌ FETCH ERROR:", error);

      setAlert({
        show: true,
        type: "error",
        message: "Erro ao carregar turmas (ver console).",
      });

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // ---------------- EDIT ----------------
  const handleEdit = (cls) => {
    const id = getClassId(cls);
    if (!id) return;

    setSelectedClass({ ...cls, class_id: id });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    try {
      const id = getClassId(selectedClass);
      if (!id) return;

      await api.updateClass(id, {
        class_name: selectedClass.class_name,
      });

      setOpenEdit(false);
      setSelectedClass(null);

      setAlert({
        show: true,
        type: "success",
        message: "Turma atualizada com sucesso!",
      });

      fetchClasses();
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (cls) => {
    const id = getClassId(cls);
    if (!id) return;

    setSelectedClass({ ...cls, class_id: id });
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const id = getClassId(selectedClass);
      if (!id) return;

      await api.deleteClass(id);

      setOpenDelete(false);
      setSelectedClass(null);

      setAlert({
        show: true,
        type: "success",
        message: "Turma removida com sucesso!",
      });

      fetchClasses();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredClasses = classes.filter((cls) =>
    `${cls.class_name} ${cls.course_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          mb: 1
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Turmas Cadastradas
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar por turma ou curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "45px",
                background: "white",
              },
            }}
          />

          <Button variant="contained" onClick={() => navigate("/registercourses")}>
            Adicionar salas
          </Button>
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <Box sx={{ borderTop: "2px solid black", pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Selecione uma turma para visualizar os alunos
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          filteredClasses.map((cls, index) => {
            const id = getClassId(cls);

            return (
              <Box key={id || index} sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>

                <Box
                  sx={{
                    flex: 1,
                    background: "#eee",
                    borderRadius: "10px",
                    padding: "12px 20px",
                    cursor: "pointer",
                  }}
                  onClick={() => id && navigate(`/class/${id}`)}
                >
                  <Typography>
                    {cls.class_name} - {cls.course_name}
                  </Typography>
                </Box>

                <IconButton onClick={() => handleEdit(cls)}>
                  <Edit sx={{ color: "#c9b037" }} />
                </IconButton>

                <IconButton onClick={() => handleDelete(cls)}>
                  <Delete sx={{ color: "red" }} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>

      {/* EDIT */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Turma</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            value={selectedClass?.class_name || ""}
            onChange={(e) =>
              setSelectedClass((prev) => ({
                ...prev,
                class_name: e.target.value,
              }))
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={saveEdit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutBase>
  );
}

export default Turmas;