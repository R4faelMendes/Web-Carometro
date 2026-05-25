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
      const { default: jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let y = 20;

      // Título
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Histórico de Ocorrências", pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, y, { align: "center" });
      doc.setTextColor(0);
      y += 10;

      // Linha separadora
      doc.setDrawColor(41, 87, 164);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      const data = filtered.length > 0 ? filtered : incidents;

      data.forEach((item, index) => {
        // Checar se precisa de nova página
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        // Cabeçalho do card
        doc.setFillColor(41, 87, 164);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 7, 1, 1, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255);
        doc.text(`#${index + 1}  ${item.incident_type}`, margin + 3, y + 5);
        doc.setTextColor(0);
        y += 10;

        // Campos
        const fields = [
          { label: "Aluno", value: item.student_name || "—" },
          { label: "Docente", value: item.user_name || "—" },
          { label: "Data", value: item.incident_date?.split("T")[0] || "—" },
          { label: "Descrição", value: item.incident_description || "—" },
        ];

        doc.setFontSize(9);
        fields.forEach(({ label, value }) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFont("helvetica", "bold");
          doc.text(`${label}:`, margin + 2, y);
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(value, pageWidth - margin * 2 - 28);
          doc.text(lines, margin + 28, y);
          y += lines.length * 5 + 1;
        });

        y += 5;

        // Linha divisória entre cards
        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      });

      doc.save("ocorrencias.pdf");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
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