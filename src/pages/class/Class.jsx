import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, IconButton, TextField, Button, Grid, Card, Avatar, CircularProgress
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function StudentsList() {
  const navigate = useNavigate();
  const { classId } = useParams(); 

  // 1. DADOS DO USUÁRIO E LÓGICA DE PERMISSÃO
  const user = JSON.parse(localStorage.getItem("user"));
  const professorName = user?.name || "Professor";
  
  // Verifica se o tipo de usuário é admin (independente de maiúsculas/minúsculas)
  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  
  const [classInfo, setClassInfo] = useState({ 
    class_name: "...", 
    course_name: "Carregando curso" 
  });

  const fetchStudents = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      const response = await api.getStudentsByClass(classId);
      const data = response.data?.data || response.data || [];
      
      setStudents(data);

      if (data.length > 0) {
        setClassInfo({
          class_name: data[0].class_name,
          course_name: data[0].course_name
        });
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setAlert({ show: true, type: "error", message: "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/menu")}>
              <ArrowBackIcon sx={{ fontSize: 35 }} />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", textDecoration: 'underline' }}>
                {classInfo.course_name} - {classInfo.class_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Professor: <strong>{professorName}</strong>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="PESQUISAR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
              }}
              sx={{
                width: "250px",
                "& .MuiOutlinedInput-root": { borderRadius: "40px", height: "45px", background: "white" },
              }}
            />
            
            {/* 3. BOTÃO ADICIONAR ALUNO - APARECE APENAS SE FOR ADMIN */}
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/registerstudent/${classId}`)}
                sx={{
                  backgroundColor: "#2957A4",
                  borderRadius: "10px",
                  height: "45px",
                  textTransform: 'none',
                  fontWeight: 'bold',
                  "&:hover": { backgroundColor: "#1e3f7a" }
                }}
              >
                Adicionar Aluno
              </Button>
            )}
          </Box>
        </Box>

        {alert.show && (
          <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {filteredStudents.map((student) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={student.student_id || student.id}>
                <Card 
                  onClick={() => navigate(`/student-details/${student.student_id || student.id}`)}
                  sx={{ 
                    backgroundColor: "#2957A4", borderRadius: "15px", p: 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    cursor: 'pointer', '&:hover': { transform: 'scale(1.02)', transition: '0.2s' }
                  }}
                >
                  <Box sx={{ 
                    width: '100%', aspectRatio: '1/1', backgroundColor: 'white', 
                    borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 
                  }}>
                    <Avatar
                      src={student.photo} 
                      variant="square"
                      sx={{ width: '90%', height: '90%', borderRadius: '5px' }}
                    />
                  </Box>
                  <Box sx={{ width: '100%', backgroundColor: '#001A4D', py: 0.5, borderRadius: '5px', textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {student.name}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredStudents.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: 5, color: 'gray' }}>
            {isAdmin 
              ? 'Nenhum aluno encontrado nesta sala. Clique em "Adicionar Aluno" para começar.'
              : 'Nenhum aluno encontrado nesta sala.'}
          </Typography>
        )}
      </Box>
    </LayoutBase>
  );
}

export default StudentsList;