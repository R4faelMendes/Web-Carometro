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
  Button,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Edit,
  Delete,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import generateGeneralIncidentsPdf from "../../components/allIncidentsTemplate/AllIncidentsTemplate";
import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";
import { useTheme } from "../../components/colors/Colors";

function Incidents() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const fetchIncidents = async () => {
    try {
      const res = await api.getAllIncidents();
      setIncidents(res.data.data || []);
    } catch {
      setAlert({ show: true, type: "error", message: "Erro ao buscar ocorrências" });
    }
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleDelete = (item) => { setSelected(item); setOpenDelete(true); };

  const confirmDelete = async () => {
    try {
      await api.deleteIncident(selected.incident_id);
      setOpenDelete(false);
      setAlert({ show: true, type: "success", message: "Ocorrência deletada!" });
      fetchIncidents();
    } catch {
      setAlert({ show: true, type: "error", message: "Erro ao deletar" });
    }
  };

  const handleEdit = (item) => { setSelected({ ...item }); setOpenEdit(true); };

  const saveEdit = async () => {
    try {
      await api.updateIncident(selected.incident_id, {
        incident_type: selected.incident_type,
        incident_description: selected.incident_description,
      });
      setOpenEdit(false);
      setAlert({ show: true, type: "success", message: "Ocorrência atualizada!" });
      fetchIncidents();
    } catch {
      setAlert({ show: true, type: "error", message: "Erro ao atualizar" });
    }
  };

const handleExportPdf = async () => {
     try {
         const html2pdf = (await import("html2pdf.js")).default;
 
         const html = generateGeneralIncidentsPdf(incidents);
 
         const element = document.createElement("div");
         element.innerHTML = html;
 
         const opt = {
             margin: 0,
             filename: `relatorio_ocorrencias.pdf`,
             image: { type: "jpeg", quality: 1 },
             html2canvas: { scale: 3 },
             jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
         };
 
         html2pdf().from(element).set(opt).save();
 
     } catch (err) {
         console.error(err);
         setAlert({ show: true, type: "error", message: "Erro ao gerar PDF" });
     }
 };

  const filtered = incidents.filter((item) =>
    `${item.student_name} ${item.user_name} ${item.incident_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const inputStyle = {
    flex: 1,
    maxHeight: "45px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "40px",
      height: "45px",
      background: theme.contrast,
      color: theme.text,
      "& fieldset": { borderColor: theme.primary },
      "&:hover fieldset": { borderColor: theme.secondary },
      "&.Mui-focused fieldset": { borderColor: theme.focus },
    },
    "& input": { color: theme.text },
    "& input::placeholder": { color: theme.text, opacity: 0.5 },
  };

  const modalInputStyle = {
    "& .MuiOutlinedInput-root": {
      color: theme.text,
      "& fieldset": { borderColor: theme.primary },
      "&:hover fieldset": { borderColor: theme.secondary },
      "&.Mui-focused fieldset": { borderColor: theme.focus },
    },
    "& .MuiInputLabel-root": { color: theme.text, opacity: 0.7 },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.primary },
    "& input": { color: theme.text },
  };

  const dialogProps = {
    PaperProps: { sx: { background: theme.background, color: theme.text } },
  };

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: theme.primary }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.text }}>
              Histórico de Ocorrências
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={inputStyle}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: theme.primary }} />,
            }}
          />

          <Tooltip title="Exportar PDF">
            <IconButton
              onClick={handleExportPdf}
              sx={{
                backgroundColor: theme.primary,
                color: theme.background,
                borderRadius: "10px",
                px: 1.5,
                "&:hover": { backgroundColor: theme.secondary },
              }}
            >
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Linha divisória */}
        <Box sx={{ borderTop: `2px solid ${theme.primary}`, pt: 1, mb: 3, ml: 6 }}>
          <Typography variant="body2" sx={{ color: theme.text, opacity: 0.6 }}>
            Visualize e gerencie todas as ocorrências registradas
          </Typography>
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        {/* Cards */}
        <Grid container spacing={2} mt={1}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.incident_id}>
              <Box
                sx={{
                  border: `1px solid ${theme.primary}`,
                  borderRadius: "12px",
                  padding: "14px",
                  background: theme.contrast,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ color: theme.text }}>
                    <b style={{ color: theme.primary }}>Aluno:</b> {item.student_name}
                  </Typography>
                  <Typography sx={{ color: theme.text }}>
                    <b style={{ color: theme.primary }}>Docente:</b> {item.user_name}
                  </Typography>
                  <Typography sx={{ color: theme.text }}>
                    <b style={{ color: theme.primary }}>Data:</b> {item.incident_date?.split("T")[0]}
                  </Typography>
                  <Typography sx={{ color: theme.text }}>
                    <b style={{ color: theme.primary }}>Tipo:</b> {item.incident_type}
                  </Typography>
                  <Typography mb={1} sx={{ color: theme.text }}>
                    <b style={{ color: theme.primary }}>Descrição:</b> {item.incident_description}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, borderTop: `1px solid ${theme.primary}33`, pt: 1, mt: 1 }}>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit sx={{ color: "#c9b037" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item)}>
                    <Delete sx={{ color: theme.cancel }} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}

          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Typography sx={{ color: theme.text, opacity: 0.5, textAlign: "center", mt: 4 }}>
                Nenhuma ocorrência encontrada.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Modal: Editar */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} {...dialogProps}>
          <DialogTitle sx={{ color: theme.text }}>Editar Ocorrência</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Tipo"
              value={selected?.incident_type || ""}
              onChange={(e) => setSelected({ ...selected, incident_type: e.target.value })}
              sx={modalInputStyle}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descrição"
              value={selected?.incident_description || ""}
              onChange={(e) => setSelected({ ...selected, incident_description: e.target.value })}
              sx={modalInputStyle}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} sx={{ color: theme.cancel }}>
              Cancelar
            </Button>
            <Button
              onClick={saveEdit}
              variant="contained"
              sx={{ backgroundColor: theme.primary, color: theme.background, "&:hover": { backgroundColor: theme.secondary } }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal: Deletar */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)} {...dialogProps}>
          <DialogTitle sx={{ color: theme.text }}>Confirmar exclusão</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)} sx={{ color: theme.text }}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              sx={{ backgroundColor: theme.cancel, color: theme.background, "&:hover": { filter: "brightness(0.85)", backgroundColor: theme.cancel } }}
            >
              Deletar
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </LayoutBase>
  );
}

export default Incidents;