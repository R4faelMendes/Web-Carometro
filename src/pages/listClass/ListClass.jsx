import { useEffect, useState } from "react";
import LayoutBase from "../../components/layoutBase/LayoutBase";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Usuarios() {
  const navigate = useNavigate();
  const { course_id } = useParams(); // (mantido caso vá usar depois)

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [search, setSearch] = useState("");

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const fetchClasses = async () => {
    try {
      const response = await api.getClass();
      console.log("Resposta:", response.data);

      const rawClass = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      const formattedClass = rawClass.map((cls) => ({
        class_id: cls.class_id ?? cls.id ?? null,
        class_name: cls.class_name ?? cls.name ?? "Sem nome",
      }));

      // ✅ AGORA SALVA NO STATE
      setClasses(formattedClass);

    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao buscar turmas",
      });
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const getClassId = (cls) => cls?.class_id || cls?.id;

  const handleEdit = (cls) => {
    setSelectedClass(cls);
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!selectedClass) return;

    try {
      await api.patch(`/class/${getClassId(selectedClass)}`, {
        class_name: selectedClass.class_name,
      });

      setOpenEdit(false);

      setAlert({
        show: true,
        type: "success",
        message: "Turma atualizada com sucesso!",
      });

      fetchClasses();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao editar turma",
      });
    }
  };

  const handleDelete = (cls) => {
    setSelectedClass(cls);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedClass) return;

    try {
      await api.delete(`/class/${getClassId(selectedClass)}`);

      setOpenDelete(false);

      setAlert({
        show: true,
        type: "success",
        message: "Turma excluída com sucesso!",
      });

      fetchClasses();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao deletar turma",
      });
    }
  };

  const filteredClasses = Array.isArray(classes)
    ? classes.filter((cls) =>
        cls.class_name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Turmas Cadastradas
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar turma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              maxHeight: "45px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "45px",
                background: "white",
              },
            }}
          />

          <Button
            variant="contained"
            onClick={() => navigate("/registercourses")}
            sx={{
              height: "45px",
              borderRadius: "20px",
              whiteSpace: "nowrap",
            }}
          >
            Adicionar sala
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
            Clique na turma para visualizar os alunos
          </Typography>
        </Box>

        {filteredClasses.map((cls, index) => (
          <Box
            key={`${cls.class_id || cls.id}-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                background: "#eee",
                borderRadius: "10px",
                padding: "12px 20px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/alunos/${getClassId(cls)}`)}
            >
              {cls.class_name}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={() => handleEdit(cls)}>
                <Edit sx={{ color: "#c9b037" }} />
              </IconButton>

              <IconButton onClick={() => handleDelete(cls)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* EDITAR */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Editar Turma</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              value={selectedClass?.class_name || ""}
              onChange={(e) =>
                setSelectedClass({
                  ...selectedClass,
                  class_name: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={saveEdit}>Salvar</Button>
          </DialogActions>
        </Dialog>

        {/* DELETAR */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Excluir Turma</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir {selectedClass?.class_name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
            <Button color="error" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LayoutBase>
  );
}

export default Usuarios;