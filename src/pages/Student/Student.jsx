import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Typography, IconButton, Button, CircularProgress, Avatar, Grid, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Student() {
    const navigate = useNavigate();
    const { studentId } = useParams();

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
            const [studentsRes, classesRes] = await Promise.all([
                api.readAllStudents(),
                api.getAllClasses()
            ]);

            const currentStudent = studentsRes.data?.data.find(s => s.student_id === parseInt(studentId));
            setStudent(currentStudent);
            setClasses(classesRes.data?.data || []);

            if (currentStudent) {
                setEditData({
                    student_name: currentStudent.student_name,
                    student_cpf: currentStudent.student_cpf,
                    fk_class_id: currentStudent.fk_class_id
                });
            }
        } catch (error) {
            setAlert({ show: true, type: "error", message: "Erro ao carregar dados." });
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
        } catch (e) {
            setAlert({ show: true, type: "error", message: "Erro ao atualizar." });
        }
    };

    const handleCreateIncident = async () => {
        if (!incidentData.incident_type) {
            setAlert({ show: true, type: "error", message: "O tipo de ocorrência é obrigatório." });
            return;
        }
        try {
            await api.createIncident({
                ...incidentData,
                fk_student_id: studentId
            });
            setAlert({ show: true, type: "success", message: "Ocorrência registrada!" });
            setOpenIncident(false);
            setIncidentData({ incident_type: "", incident_description: "" });
            fetchIncidents();
        } catch (e) {
            setAlert({ show: true, type: "error", message: "Erro ao registrar ocorrência." });
        }
    };

    const handleDeleteStudent = async () => {
        try {
            await api.deleteStudent(studentId);
            setAlert({ show: true, type: "success", message: "Aluno removido!" });
            setTimeout(() => navigate(-1), 1500);
        } catch (e) {
            setAlert({ show: true, type: "error", message: "Erro ao remover." });
        }
    };

    const confirmDeleteIncident = async () => {
        try {
            await api.deleteIncident(selected.incident_id);
            setOpenDeleteIncident(false);
            setAlert({ show: true, type: "success", message: "Ocorrência deletada!" });
            fetchIncidents();
        } catch (err) {
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
        } catch (err) {
            setAlert({ show: true, type: "error", message: "Erro ao atualizar" });
        }
    };

    const smallButtonStyle = {
        fontSize: '0.65rem',
        padding: '4px 10px',
        minWidth: '140px',
        textTransform: 'none',
        borderRadius: '6px',
        fontWeight: 'bold'
    };



    return (
        <LayoutBase>
            <Box sx={{ p: { xs: 2, md: 2 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ border: '2px solid black', p: 0.5 }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: 'underline' }}>
                        Detalhes do Aluno
                    </Typography>
                </Box>

                {alert.show && <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />}

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                            <Box sx={{ bgcolor: '#2b58a1', py: 1, px: 1, borderRadius: 2, textAlign: 'center', width: '180px' }}>
                                <Avatar variant="square" sx={{ width: '100%', height: 130, mb: 1, borderRadius: 1, bgcolor: 'white' }} />
                                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>ALUNO</Typography>
                            </Box>
                            {isAdmin && (
                                <Button variant="contained" sx={{ ...smallButtonStyle, bgcolor: '#3b6bb8' }} onClick={() => setOpenEdit(true)}>
                                    Atualizar Perfil
                                </Button>
                            )}
                            <Button variant="contained" sx={{ ...smallButtonStyle, bgcolor: '#3b6bb8' }} onClick={() => setOpenIncident(true)}>
                                Registrar Ocorrência
                            </Button>
                            {isAdmin && (
                                <Button variant="contained" sx={{ ...smallButtonStyle, bgcolor: '#942609', mt: 2 }} onClick={() => setOpenDelete(true)}>
                                    Remover Aluno
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>INFORMAÇÕES ALUNO</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Paper variant="outlined" sx={{ py: 1.2, px: 40, borderRadius: 2 }}>
                                <Typography><b>ALUNO :</b> {student?.student_name}</Typography>
                            </Paper>
                            <Paper variant="outlined" sx={{ py: 1.2, px: 40, borderRadius: 2 }}>
                                <Typography><b>TURMA :</b> {getClassName(student?.fk_class_id)}</Typography>
                            </Paper>
                            <Paper variant="outlined" sx={{ py: 1.2, px: 40, borderRadius: 2 }}>
                                <Typography><b>CPF :</b> {student?.student_cpf}</Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Ocorrências
                    </Typography>

                    {incidents.length === 0 ? (
                        <Typography>Nenhuma ocorrência encontrada.</Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row', // Alinha em linha (horizontal)
                                gap: 2,
                                overflowX: 'auto', // Adiciona scroll se houver muitos cards
                                pb: 2, // Espaço para não cortar a sombra no scroll
                                '&::-webkit-scrollbar': { height: '8px' }, // Customização da barra de rolagem
                                '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '4px' }
                            }}
                        >
                            {incidents.map((item) => (
                                <Paper
                                    key={item.incident_id}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        width: '200px', 
                                        height: '150px', 
                                        flexShrink: 0, // Impede que o card amasse
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderRadius: 2, 
                                        bgcolor: '#f9f9f9'
                                    }}
                                >
                                    <Box sx={{ overflowY: 'auto' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2b58a1' }}>
                                            {item.incident_type}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-word' }}>
                                            {item.incident_description}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => { setSelected(item); setOpenEditIncident(true); }}
                                        >
                                            <EditIcon fontSize="small" sx={{ color: "#c9b037" }} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => { setSelected(item); setOpenDeleteIncident(true); }}
                                        >
                                            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Modal: Editar Aluno */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
                <DialogTitle>Editar Aluno</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Nome" margin="dense" value={editData.student_name} onChange={(e) => setEditData({ ...editData, student_name: e.target.value })} />
                    <TextField fullWidth label="CPF" margin="dense" value={editData.student_cpf} onChange={(e) => setEditData({ ...editData, student_cpf: e.target.value })} />
                    <TextField select fullWidth label="Turma" margin="dense" value={editData.fk_class_id} onChange={(e) => setEditData({ ...editData, fk_class_id: e.target.value })}>
                        {classes.map((c) => (
                            <MenuItem key={c.class_id} value={c.class_id}>{c.class_name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
                    <Button onClick={handleUpdateStudent} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Criar Ocorrência */}
            <Dialog open={openIncident} onClose={() => setOpenIncident(false)} fullWidth maxWidth="xs">
                <DialogTitle>Registrar Ocorrência</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Tipo" margin="dense" value={incidentData.incident_type} onChange={(e) => setIncidentData({ ...incidentData, incident_type: e.target.value })} />
                    <TextField fullWidth multiline rows={3} label="Descrição" margin="dense" value={incidentData.incident_description} onChange={(e) => setIncidentData({ ...incidentData, incident_description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenIncident(false)}>Cancelar</Button>
                    <Button onClick={handleCreateIncident} variant="contained">Registrar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Editar Ocorrência */}
            <Dialog open={openEditIncident} onClose={() => setOpenEditIncident(false)} fullWidth maxWidth="xs">
                <DialogTitle>Editar Ocorrência</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Tipo" margin="dense" value={selected?.incident_type || ""} onChange={(e) => setSelected({ ...selected, incident_type: e.target.value })} />
                    <TextField fullWidth multiline rows={4} label="Descrição" margin="dense" value={selected?.incident_description || ""} onChange={(e) => setSelected({ ...selected, incident_description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditIncident(false)}>Cancelar</Button>
                    <Button onClick={saveEditIncident} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Deletar Ocorrência */}
            <Dialog open={openDeleteIncident} onClose={() => setOpenDeleteIncident(false)}>
                <DialogTitle>Deletar Ocorrência</DialogTitle>
                <DialogContent>Tem certeza que deseja excluir esta ocorrência?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteIncident(false)}>Cancelar</Button>
                    <Button onClick={confirmDeleteIncident} color="error" variant="contained">Excluir</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Deletar Aluno */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Remover Aluno</DialogTitle>
                <DialogContent>Confirmar a exclusão de {student?.student_name}?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Sair</Button>
                    <Button onClick={handleDeleteStudent} color="error" variant="contained">Excluir</Button>
                </DialogActions>
            </Dialog>
        </LayoutBase>
    );
}

export default Student;