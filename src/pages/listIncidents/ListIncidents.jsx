import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Edit,
  Delete
} from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: ""
  });

  const fetchIncidents = async () => {
    try {
      const res = await api.getAllIncidents();
      setIncidents(res.data.data || []);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao buscar ocorrências"
      });
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleDelete = (item) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteIncident(selected.incident_id);

      setOpenDelete(false);

      setAlert({
        show: true,
        type: "success",
        message: "Ocorrência deletada!"
      });

      fetchIncidents();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao deletar"
      });
    }
  };

  const handleEdit = (item) => {
    setSelected({ ...item });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    try {
      await api.updateIncident(selected.incident_id, {
        incident_type: selected.incident_type,
        incident_description: selected.incident_description
      });

      setOpenEdit(false);

      setAlert({
        show: true,
        type: "success",
        message: "Ocorrência atualizada!"
      });

      fetchIncidents();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao atualizar"
      });
    }
  };

  const filtered = incidents.filter((item) =>
    `${item.student_name} ${item.user_name} ${item.incident_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Histórico de Ocorrências
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              maxHeight: "45px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "45px",
                background: "white"
              }
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1 }} />
              )
            }}
          />
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <Grid container spacing={2} mt={1}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.incident_id}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "#f5f5f5"
                }}
              >
                <Typography><b>Aluno:</b> {item.student_name}</Typography>
                <Typography><b>Docente:</b> {item.user_name}</Typography>
                <Typography>
                  <b>Data:</b> {item.incident_date?.split("T")[0]}
                </Typography>
                <Typography><b>Tipo:</b> {item.incident_type}</Typography>
                <Typography mb={1}>
                  <b>Descrição:</b> {item.incident_description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit sx={{ color: "#c9b037" }} />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(item)}>
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* EDIT */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Editar Ocorrência</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Tipo"
              value={selected?.incident_type || ""}
              onChange={(e) =>
                setSelected({ ...selected, incident_type: e.target.value })
              }
            />

            <TextField
              fullWidth
              margin="normal"
              label="Descrição"
              value={selected?.incident_description || ""}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  incident_description: e.target.value
                })
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

      </Box>
    </LayoutBase>
  );
}

export default Incidents;