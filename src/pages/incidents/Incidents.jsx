import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [newIncident, setNewIncident] = useState({
    incident_type: "",
    incident_description: "",
    fk_student_id: ""
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: ""
  });

  // 🔥 BUSCAR INCIDENTES
  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incident");
      setIncidents(res.data?.data || []);
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

  // 🔥 CRIAR INCIDENTE
  const handleCreate = async () => {
    try {
      await api.post("/incident", newIncident);

      setOpenCreate(false);
      setNewIncident({
        incident_type: "",
        incident_description: "",
        fk_student_id: ""
      });

      setAlert({
        show: true,
        type: "success",
        message: "Ocorrência criada com sucesso!"
      });

      fetchIncidents();
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: err.response?.data?.message || "Erro ao criar ocorrência"
      });
    }
  };

  // 🔍 FILTRO
  const filtered = incidents.filter((item) =>
    `${item.student_name} ${item.user_name} ${item.incident_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>

        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textDecoration: "underline" }}
              >
                Histórico de Ocorrência
              </Typography>
              <Typography variant="body2" sx={{ color: "#444", fontSize: "0.8rem" }}>
                Visualize e gerencie ocorrências
              </Typography>
            </Box>
          </Box>

          <TextField
            placeholder="PESQUISA..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "38px",
                background: "white"
              }
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "black", mr: 1, fontSize: 20 }} />
              )
            }}
          />

          {/* ✅ BOTÃO ADICIONAR */}
          <Button
            variant="contained"
            onClick={() => setOpenCreate(true)}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#1976d2",
              textTransform: "none",
              height: "38px"
            }}
          >
            + Adicionar
          </Button>
        </Box>

        {/* ALERT */}
        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        {/* GRID */}
        <Grid container spacing={2} mt={1}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.incident_id}>
              <Box
                sx={{
                  border: "1.5px solid black",
                  borderRadius: "12px",
                  padding: "8px 10px",
                  background: "#f5f5f5",
                  fontSize: "0.75rem"
                }}
              >
                <Typography sx={{ fontSize: "0.75rem" }}>
                  <b>ALUNO →</b> {item.student_name}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem" }}>
                  <b>DOCENTE →</b> {item.user_name}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem" }}>
                  <b>DATA →</b> {item.incident_date?.split("T")[0]}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem" }}>
                  <b>TIPO →</b> {item.incident_type}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", mb: 1 }}>
                  <b>DESC →</b> {item.incident_description}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: "#cddc39",
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      height: "26px"
                    }}
                  >
                    EDITAR
                  </Button>

                  <Button
                    size="small"
                    sx={{
                      backgroundColor: "#c62828",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      height: "26px"
                    }}
                  >
                    DELETAR
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* MODAL CRIAR */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="xs">
          <DialogTitle>Nova Ocorrência</DialogTitle>

          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="ID do Aluno"
                value={newIncident.fk_student_id}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, fk_student_id: e.target.value })
                }
              />

              <TextField
                label="Tipo"
                value={newIncident.incident_type}
                onChange={(e) =>
                  setNewIncident({ ...newIncident, incident_type: e.target.value })
                }
              />

              <TextField
                label="Descrição"
                multiline
                rows={3}
                value={newIncident.incident_description}
                onChange={(e) =>
                  setNewIncident({
                    ...newIncident,
                    incident_description: e.target.value
                  })
                }
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate}>
              Criar
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </LayoutBase>
  );
}

export default Incidents;