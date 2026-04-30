import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, IconButton, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, CircularProgress
} from "@mui/material";
import { Edit, Delete, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function ListClass() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const getClassId = (cls) => cls?.class_id || cls?.id || null;

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      
      const [resClasses, resCourses] = await Promise.all([
        api.getAllClasses(),
        api.getAllCourses()
      ]);

      const classesArray = resClasses.data?.data || [];
      const coursesArray = resCourses.data?.data || [];
      
      setAllCourses(coursesArray);


      const formatted = classesArray.map((item) => {
        const matchedCourse = coursesArray.find(c => c.course_name === item.course_name);
        
        return {
          class_id: item.class_id,
          class_name: item.class_name,
          course_name: item.course_name || "Curso não definido",
          course_id: item.fk_course_id || item.course_id || matchedCourse?.course_id 
        };
      });
      
      setClasses(formatted);
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao carregar turmas." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleEdit = (cls) => {
    setSelectedClass({ ...cls });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    try {
      const classId = getClassId(selectedClass);
      let courseId = selectedClass.course_id;

      if (!classId) throw new Error("ID da turma não encontrado.");

      if (!courseId) {
        const recoverCourse = allCourses.find(c => c.course_name === selectedClass.course_name);
        courseId = recoverCourse?.course_id;
      }

      await api.updateClass(classId, { class_name: selectedClass.class_name });

      if (courseId) {
        await api.updateCourse(courseId, { course_name: selectedClass.course_name });
      } else {
        throw new Error("Não foi possível localizar o ID do curso para este nome.");
      }

      setOpenEdit(false);
      setAlert({ show: true, type: "success", message: "Atualizado com sucesso!" });
      fetchClasses();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setAlert({ 
        show: true, 
        type: "error", 
        message: error.response?.data?.message || error.message || "Erro ao atualizar dados." 
      });
    }
  };

  const handleDelete = (cls) => {
    setSelectedClass({ ...cls });
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteClass(getClassId(selectedClass));
      setOpenDelete(false);
      setAlert({ show: true, type: "success", message: "Turma removida!" });
      fetchClasses();
    } catch (error) { 
      console.error(error);
      setAlert({ show: true, type: "error", message: "Erro ao eliminar turma." });
    }
  };

  const filteredClasses = classes.filter((cls) =>
    `${cls.class_name} ${cls.course_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/listclass")}><ArrowBackIcon /></IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Turmas Cadastradas</Typography>
          </Box>
          <TextField
            placeholder="Pesquisar por turma ou curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "40px", height: "45px", background: "white" } }}
          />
          <Button variant="contained" onClick={() => navigate("/registercourses")}>Adicionar salas</Button>
        </Box>

        {alert.show && (
          <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        )}

        <Box sx={{ borderTop: "2px solid black", pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>Selecione uma turma para editar ou visualizar alunos</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>
        ) : (
          filteredClasses.map((cls, index) => (
            <Box key={cls.class_id || index} sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <Box
                sx={{ flex: 1, background: "#eee", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}
                onClick={() => navigate(`/class/${cls.class_id}`)}
              >
                <Typography>{cls.class_name} - {cls.course_name}</Typography>
              </Box>
              <IconButton onClick={() => handleEdit(cls)}><Edit sx={{ color: "#c9b037" }} /></IconButton>
              <IconButton onClick={() => handleDelete(cls)}><Delete sx={{ color: "red" }} /></IconButton>
            </Box>
          ))
        )}
      </Box>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Editar Informações</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Nome da Turma"
              value={selectedClass?.class_name || ""}
              onChange={(e) => setSelectedClass(prev => ({ ...prev, class_name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Nome do Curso"
              value={selectedClass?.course_name || ""}
              onChange={(e) => setSelectedClass(prev => ({ ...prev, course_name: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={saveEdit} variant="contained" color="primary">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Deletar</Button>
        </DialogActions>
      </Dialog>
    </LayoutBase>
  );
}

export default ListClass;