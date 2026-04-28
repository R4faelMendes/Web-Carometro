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

  // --- MÉTODO AUXILIAR REFORÇADO ---
  const getClassId = (cls) => cls?.class_id || cls?.id || cls?.id_class || null;

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      // Chamada via AxiosService
      const response = await api.getAllCourses(); 
      const rawData = response.data?.data || response.data || [];

      // Mapeamento que garante a existência do ID da Turma e nome do Curso
      const formattedClasses = rawData.map((item) => ({
        // Se a API retornar a turma dentro do curso, ajuste 'item.id' para a chave correta
        class_id: item.class_id || item.id, 
        class_name: item.class_name || item.name || "Sem nome",
        course_id: item.course_id || item.id_curso,
        course_name: item.course_name || item.course?.name || "Curso Geral",
      }));

      setClasses(formattedClasses);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      setAlert({ show: true, type: "error", message: "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // --- HANDLERS COM PROTEÇÃO CONTRA NULL ---
  const handleEdit = (cls) => {
    const id = getClassId(cls);
    if (!id) {
      setAlert({ show: true, type: "error", message: "ID da turma não encontrado." });
      return;
    }
    setSelectedClass({ ...cls, class_id: id });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    const idClass = getClassId(selectedClass);
    if (!idClass) return;

    try {
      // Alinhado com api.updateClass do seu apiService
      await api.updateClass(idClass, { class_name: selectedClass.class_name });
      
      setOpenEdit(false);
      setAlert({ show: true, type: "success", message: "Turma atualizada com sucesso!" });
      fetchClasses();
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao atualizar a turma." });
    }
  };

  const handleDelete = (cls) => {
    const id = getClassId(cls);
    if (!id) {
      setAlert({ show: true, type: "error", message: "ID inválido para exclusão." });
      return;
    }
    setSelectedClass({ ...cls, class_id: id });
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    const id = getClassId(selectedClass);
    try {
      // Alinhado com api.deleteClass do seu apiService
      await api.deleteClass(id);
      setOpenDelete(false);
      setAlert({ show: true, type: "success", message: "Turma removida com sucesso!" });
      fetchClasses();
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao deletar turma." });
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
            <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Turmas Cadastradas</Typography>
          </Box>

          <TextField
            placeholder="Pesquisar por turma ou curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "40px", height: "45px", background: "white" } }}
          />

          <Button 
            variant="contained" 
            onClick={() => navigate("/registercourses")}
            sx={{ height: "45px", borderRadius: "20px", backgroundColor: "#2957A4" }}
          >
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
            Selecione uma turma para visualizar os alunos (Carômetro)
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : (
          filteredClasses.map((cls, index) => {
            const currentId = getClassId(cls);
            return (
              <Box key={currentId || index} sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                <Box
                  sx={{ 
                    flex: 1, background: "#eee", borderRadius: "10px", padding: "12px 20px", cursor: "pointer",
                    "&:hover": { background: "#e0e0e0" } 
                  }}
                  onClick={() => currentId ? navigate(`/class/${currentId}`) : setAlert({show:true, type:'error', message:'ID da turma não disponível'})}
                >
                  <Typography sx={{ fontWeight: '500' }}>
                    {cls.class_name} <span style={{ color: '#777', fontWeight: '400' }}>— {cls.course_name}</span>
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

      {/* MODAL EDITAR */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Nome da Turma</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Nome da Turma"
            value={selectedClass?.class_name || ""}
            onChange={(e) => setSelectedClass(prev => ({ ...prev, class_name: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={saveEdit} variant="contained" sx={{ bgcolor: "#2957A4" }}>Salvar Alteração</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DELETAR */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir a turma <strong>{selectedClass?.class_name}</strong>? 
          Esta ação não pode ser desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Excluir Agora</Button>
        </DialogActions>
      </Dialog>
    </LayoutBase>
  );
}

export default Turmas;