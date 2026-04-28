import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Card,
  Avatar,
  CircularProgress
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Search as SearchIcon } from "@mui/icons-material";

// Importações de componentes customizados e API
import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function StudentsList() {
  const navigate = useNavigate();
  const { classId } = useParams(); // Captura o ID da URL (ex: /class/10)

  // Estados
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  
  // Estado para informações da sala (Nome do curso/turma)
  const [classInfo, setClassInfo] = useState({ class_name: "", course_name: "" });

  // --- CHAMADA À API ---
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getStudentsByClass(classId);
      
      // Ajuste conforme o retorno da sua API (geralmente data.data ou apenas data)
      const data = response.data?.data || response.data || [];
      
      setStudents(data);

      // Se a API retornar dados da sala junto, você pode setar aqui
      if (data.length > 0) {
        setClassInfo({
          class_name: data[0].class_name,
          course_name: data[0].course_name
        });
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setAlert({ show: true, type: "error", message: "Erro ao carregar alunos" });
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) fetchStudents();
  }, [fetchStudents, classId]);

  // --- FILTRO DE BUSCA ---
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ fontSize: 35 }} />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", textDecoration: 'underline' }}>
                {classInfo.course_name || "Curso"} - {classInfo.class_name || "Turma"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Professor responsável: UNKNOWN
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-end' }}>
            <TextField
              placeholder="PESQUISA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
              }}
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": { borderRadius: "40px", height: "45px", background: "white" },
              }}
            />
            <Button
              variant="contained"
              sx={{ height: "45px", borderRadius: "10px", backgroundColor: "#2957A4" }}
            >
              + Adicionar Aluno
            </Button>
          </Box>
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        {/* Grid de Alunos (O Carômetro) */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredStudents.map((student) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
                <Card sx={{ 
                  backgroundColor: "#2957A4", 
                  borderRadius: "15px", 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.02)', transition: '0.2s' }
                }}>
                  {/* Container da Foto (Branco conforme imagem) */}
                  <Box sx={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    backgroundColor: 'white', 
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Avatar
                      src={student.photo} // URL da foto vinda da API
                      variant="square"
                      sx={{ width: '85%', height: '85%', borderRadius: '5px' }}
                    />
                  </Box>
                  
                  {/* Nome do Aluno (Fundo escuro conforme imagem) */}
                  <Box sx={{ 
                    width: '100%', 
                    backgroundColor: '#001A4D', 
                    py: 0.5, 
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {student.name || "Aluno"}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredStudents.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: 5, color: 'gray' }}>
            Nenhum aluno encontrado nesta sala.
          </Typography>
        )}
      </Box>
    </LayoutBase>
  );
}

export default StudentsList;