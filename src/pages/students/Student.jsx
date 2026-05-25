import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Typography, IconButton, Button, CircularProgress, Avatar, Grid, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Tooltip
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";
import { useTheme } from "../../components/colors/Colors";

function Student() {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const { theme } = useTheme();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.user_type?.toLowerCase() === "admin";

    const [student, setStudent] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const [openEdit, setOpenEdit] = useState(false);
    const [openIncident, setOpenIncident] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [editData, setEditData] = useState({ student_name: "", student_cpf: "", fk_class_id: "" });
    const [incidentData, setIncidentData] = useState({ incident_type: "", incident_description: "" });

    const [incidents, setIncidents] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openEditIncident, setOpenEditIncident] = useState(false);
    const [openDeleteIncident, setOpenDeleteIncident] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const studentsRes = await api.readAllStudents();
            const allStudents = studentsRes.data?.data || [];
            const currentStudent = allStudents.find(s => s.student_id === parseInt(studentId));

            if (currentStudent) {
                setStudent(currentStudent);
                setEditData({
                    student_name: currentStudent.student_name,
                    student_cpf: currentStudent.student_cpf,
                    fk_class_id: currentStudent.fk_class_id
                });
            }

            try {
                const classesRes = await api.getAllClasses();
                setClasses(classesRes.data?.data || []);
            } catch {
                setClasses([]);
            }
        } catch (error) {
            setAlert({ show: true, type: "error", message: "Erro ao carregar dados do aluno." });
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    const fetchIncidents = useCallback(async () => {
        try {
            const res = await api.getIncidentsByStudentId(studentId);
            setIncidents(res.data.data || []);
        } catch (err) {
            console.error("Erro ao buscar ocorrências", err);
        }
    }, [studentId]);

    useEffect(() => {
        fetchData();
        fetchIncidents();
    }, [fetchData, fetchIncidents]);

    const getClassName = (id) => {
        const classObj = classes.find(c => c.class_id === id);
        return classObj ? classObj.class_name : "Não atribuída";
    };

    const handleUpdateStudent = async () => {
        try {
            await api.updateStudent(studentId, editData);
            setAlert({ show: true, type: "success", message: "Aluno atualizado!" });
            setOpenEdit(false);
            fetchData();
        } catch {
            setAlert({ show: true, type: "error", message: "Erro ao atualizar." });
        }
    };

    const handleCreateIncident = async () => {
        if (!incidentData.incident_type) {
            setAlert({ show: true, type: "error", message: "O tipo de ocorrência é obrigatório." });
            return;
        }
        try {
            await api.createIncident({ ...incidentData, fk_student_id: studentId });
            setAlert({ show: true, type: "success", message: "Ocorrência registrada!" });
            setOpenIncident(false);
            setIncidentData({ incident_type: "", incident_description: "" });
            fetchIncidents();
        } catch {
            setAlert({ show: true, type: "error", message: "Erro ao registrar ocorrência." });
        }
    };

    const handleDeleteStudent = async () => {
        try {
            await api.deleteStudent(studentId);
            setAlert({ show: true, type: "success", message: "Aluno removido!" });
            setTimeout(() => navigate(-1), 1500);
        } catch {
            setAlert({ show: true, type: "error", message: "Erro ao remover." });
        }
    };

    const confirmDeleteIncident = async () => {
        try {
            await api.deleteIncident(selected.incident_id);
            setOpenDeleteIncident(false);
            setAlert({ show: true, type: "success", message: "Ocorrência deletada!" });
            fetchIncidents();
        } catch {
            setAlert({ show: true, type: "error", message: "Erro ao deletar" });
        }
    };

    const saveEditIncident = async () => {
        try {
            await api.updateIncident(selected.incident_id, {
                incident_type: selected.incident_type,
                incident_description: selected.incident_description
            });
            setOpenEditIncident(false);
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

            const studentName = student?.student_name || "Aluno";

            // Título com nome do aluno
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(`Ocorrências - ${studentName}`, pageWidth / 2, y, { align: "center" });
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

            incidents.forEach((item, index) => {
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
                    { label: "Aluno", value: studentName },
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

            doc.save(`ocorrencias_${studentName}.pdf`);
        } catch (err) {
            console.error("Erro ao gerar PDF:", err);
            setAlert({ show: true, type: "error", message: "Erro ao gerar PDF" });
        }
    };

    const smallButtonStyle = {
        fontSize: "0.65rem",
        padding: "4px 10px",
        minWidth: "140px",
        textTransform: "none",
        borderRadius: "6px",
        fontWeight: "bold",
        backgroundColor: theme.primary,
        color: theme.background,
        "&:hover": { backgroundColor: theme.secondary },
    };

    const inputStyle = {
        "& .MuiOutlinedInput-root": {
            color: theme.text,
            "& fieldset": { borderColor: theme.primary },
            "&:hover fieldset": { borderColor: theme.secondary },
            "&.Mui-focused fieldset": { borderColor: theme.focus },
        },
        "& .MuiInputLabel-root": { color: theme.text, opacity: 0.7 },
        "& .MuiInputLabel-root.Mui-focused": { color: theme.primary },
        "& textarea": { color: theme.text },
    };

    const dialogProps = {
        PaperProps: { sx: { background: theme.background, color: theme.text } },
    };

    return (
        <LayoutBase>
            <Box sx={{ p: { xs: 2, md: 2 } }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{ border: `2px solid ${theme.primary}`, p: 0.5, color: theme.primary }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline", color: theme.text }}>
                        Detalhes do Aluno
                    </Typography>
                </Box>

                {alert.show && (
                    <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
                )}

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Coluna esquerda: avatar + botões */}
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                            <Box sx={{ bgcolor: theme.primary, py: 1, px: 1, borderRadius: 2, textAlign: "center", width: "180px" }}>
                                <Avatar
                                    variant="square"
                                    sx={{ width: "100%", height: 130, mb: 1, borderRadius: 1, bgcolor: theme.contrast }}
                                />
                                <Typography sx={{ color: theme.background, fontWeight: "bold", fontSize: "0.8rem" }}>
                                    ALUNO
                                </Typography>
                            </Box>

                            {isAdmin && (
                                <Button variant="contained" sx={smallButtonStyle} onClick={() => setOpenEdit(true)}>
                                    Atualizar Perfil
                                </Button>
                            )}
                            <Button variant="contained" sx={smallButtonStyle} onClick={() => setOpenIncident(true)}>
                                Registrar Ocorrência
                            </Button>
                            {incidents.length > 0 && (
                                <Tooltip title="Exportar PDF">
                                    <Button
                                        variant="contained"
                                        startIcon={<PictureAsPdfIcon />}
                                        sx={smallButtonStyle}
                                        onClick={handleExportPdf}
                                    >
                                        Exportar PDF
                                    </Button>
                                </Tooltip>
                            )}
                            {isAdmin && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        ...smallButtonStyle,
                                        mt: 2,
                                        backgroundColor: theme.cancel,
                                        "&:hover": { filter: "brightness(0.85)", backgroundColor: theme.cancel },
                                    }}
                                    onClick={() => setOpenDelete(true)}
                                >
                                    Remover Aluno
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    {/* Coluna direita: informações */}
                    <Grid item xs={12} md={9}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center", color: theme.text }}>
                            INFORMAÇÕES ALUNO
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {[
                                { label: "ALUNO", value: student?.student_name },
                                { label: "TURMA", value: getClassName(student?.fk_class_id) },
                                { label: "CPF", value: student?.student_cpf },
                            ].map(({ label, value }) => (
                                <Paper
                                    key={label}
                                    variant="outlined"
                                    sx={{
                                        py: 1.2,
                                        px: 3,
                                        borderRadius: 2,
                                        bgcolor: theme.contrast,
                                        borderColor: theme.primary,
                                    }}
                                >
                                    <Typography sx={{ color: theme.text }}>
                                        <b style={{ color: theme.primary }}>{label} : </b>{value}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* Ocorrências */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: theme.text }}>
                        Ocorrências
                    </Typography>

                    {incidents.length === 0 ? (
                        <Typography sx={{ color: theme.text, opacity: 0.5 }}>
                            Nenhuma ocorrência encontrada.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2,
                                overflowX: "auto",
                                pb: 2,
                                "&::-webkit-scrollbar": { height: "8px" },
                                "&::-webkit-scrollbar-thumb": { bgcolor: theme.primary, borderRadius: "4px" },
                            }}
                        >
                            {incidents.map((item) => (
                                <Paper
                                    key={item.incident_id}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        width: "200px",
                                        height: "150px",
                                        flexShrink: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        borderRadius: 2,
                                        bgcolor: theme.contrast,
                                        borderColor: theme.primary,
                                    }}
                                >
                                    <Box sx={{ overflowY: "auto" }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: theme.primary }}>
                                            {item.incident_type}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, wordBreak: "break-word", color: theme.text }}>
                                            {item.incident_description}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, mt: 1, pt: 1, borderTop: `1px solid ${theme.primary}33` }}>
                                        <IconButton size="small" onClick={() => { setSelected(item); setOpenEditIncident(true); }}>
                                            <EditIcon fontSize="small" sx={{ color: "#c9b037" }} />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => { setSelected(item); setOpenDeleteIncident(true); }}>
                                            <DeleteIcon fontSize="small" sx={{ color: theme.cancel }} />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Modal: Editar Aluno */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs" {...dialogProps}>
                <DialogTitle sx={{ color: theme.text }}>Editar Aluno</DialogTitle>
                <DialogContent dividers sx={{ borderColor: theme.primary + "44" }}>
                    <TextField fullWidth label="Nome" margin="dense" value={editData.student_name}
                        onChange={(e) => setEditData({ ...editData, student_name: e.target.value })} sx={inputStyle} />
                    <TextField fullWidth label="CPF" margin="dense" value={editData.student_cpf}
                        onChange={(e) => setEditData({ ...editData, student_cpf: e.target.value })} sx={inputStyle} />
                    <TextField select fullWidth label="Turma" margin="dense" value={editData.fk_class_id}
                        onChange={(e) => setEditData({ ...editData, fk_class_id: e.target.value })}
                        sx={inputStyle}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        background: theme.background,
                                        color: theme.text,
                                        "& .MuiMenuItem-root:hover": { background: theme.contrast },
                                    },
                                },
                            },
                        }}
                    >
                        {classes.map((c) => (
                            <MenuItem key={c.class_id} value={c.class_id} sx={{ color: theme.text }}>
                                {c.class_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} sx={{ color: theme.cancel }}>Cancelar</Button>
                    <Button onClick={handleUpdateStudent} variant="contained"
                        sx={{ backgroundColor: theme.primary, color: theme.background, "&:hover": { backgroundColor: theme.secondary } }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Criar Ocorrência */}
            <Dialog open={openIncident} onClose={() => setOpenIncident(false)} fullWidth maxWidth="xs" {...dialogProps}>
                <DialogTitle sx={{ color: theme.text }}>Registrar Ocorrência</DialogTitle>
                <DialogContent dividers sx={{ borderColor: theme.primary + "44" }}>
                    <TextField fullWidth label="Tipo" margin="dense" value={incidentData.incident_type}
                        onChange={(e) => setIncidentData({ ...incidentData, incident_type: e.target.value })} sx={inputStyle} />
                    <TextField fullWidth multiline rows={3} label="Descrição" margin="dense" value={incidentData.incident_description}
                        onChange={(e) => setIncidentData({ ...incidentData, incident_description: e.target.value })} sx={inputStyle} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenIncident(false)} sx={{ color: theme.cancel }}>Cancelar</Button>
                    <Button onClick={handleCreateIncident} variant="contained"
                        sx={{ backgroundColor: theme.primary, color: theme.background, "&:hover": { backgroundColor: theme.secondary } }}>
                        Registrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Editar Ocorrência */}
            <Dialog open={openEditIncident} onClose={() => setOpenEditIncident(false)} fullWidth maxWidth="xs" {...dialogProps}>
                <DialogTitle sx={{ color: theme.text }}>Editar Ocorrência</DialogTitle>
                <DialogContent dividers sx={{ borderColor: theme.primary + "44" }}>
                    <TextField fullWidth label="Tipo" margin="dense" value={selected?.incident_type || ""}
                        onChange={(e) => setSelected({ ...selected, incident_type: e.target.value })} sx={inputStyle} />
                    <TextField fullWidth multiline rows={4} label="Descrição" margin="dense" value={selected?.incident_description || ""}
                        onChange={(e) => setSelected({ ...selected, incident_description: e.target.value })} sx={inputStyle} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditIncident(false)} sx={{ color: theme.cancel }}>Cancelar</Button>
                    <Button onClick={saveEditIncident} variant="contained"
                        sx={{ backgroundColor: theme.primary, color: theme.background, "&:hover": { backgroundColor: theme.secondary } }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Deletar Ocorrência */}
            <Dialog open={openDeleteIncident} onClose={() => setOpenDeleteIncident(false)} {...dialogProps}>
                <DialogTitle sx={{ color: theme.text }}>Deletar Ocorrência</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: theme.text }}>Tem certeza que deseja excluir esta ocorrência?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteIncident(false)} sx={{ color: theme.text }}>Cancelar</Button>
                    <Button onClick={confirmDeleteIncident} variant="contained"
                        sx={{ backgroundColor: theme.cancel, color: theme.background, "&:hover": { filter: "brightness(0.85)", backgroundColor: theme.cancel } }}>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Deletar Aluno */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} {...dialogProps}>
                <DialogTitle sx={{ color: theme.text }}>Remover Aluno</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: theme.text }}>
                        Confirmar a exclusão de {student?.student_name}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} sx={{ color: theme.text }}>Sair</Button>
                    <Button onClick={handleDeleteStudent} variant="contained"
                        sx={{ backgroundColor: theme.cancel, color: theme.background, "&:hover": { filter: "brightness(0.85)", backgroundColor: theme.cancel } }}>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </LayoutBase>
    );
}

export default Student;