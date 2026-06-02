import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";
import { useTheme } from "../../components/colors/Colors";

const getImageSrc = (picture) => {
  if (!picture || typeof picture !== 'string') return undefined;
  if (picture.startsWith('data:') || picture.startsWith('http')) return picture;

  // Detect common base64 signatures
  if (picture.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${picture}`;
  } else if (picture.startsWith('iVBORw0KGgo')) {
    return `data:image/png;base64,${picture}`;
  } else if (picture.startsWith('R0lGODlh')) {
    return `data:image/gif;base64,${picture}`;
  } else if (picture.startsWith('UklGR')) {
    return `data:image/webp;base64,${picture}`;
  } else {
    return `data:image/jpeg;base64,${picture}`;
  }
};

function StudentsList() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { theme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const classInfo = { class_name: "Sala de Aula" };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getStudentsByClass(classId);
      const data = response.data?.data || [];
      setStudents(data);
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao carregar alunos." });
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filteredStudents = students.filter((student) =>
    student.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/menu")} sx={{ color: theme.primary }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.text }}>
              {classInfo.class_name}
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
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
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: theme.primary, mr: 1 }} />
              ),
            }}
          />

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/registerstudent/${classId}`)}
              sx={{
                backgroundColor: theme.primary,
                color: theme.background,
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { backgroundColor: theme.secondary },
              }}
            >
              Adicionar
            </Button>
          )}
        </Box>

        {/* Linha divisória */}
        <Box sx={{ borderTop: `2px solid ${theme.primary}`, pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: theme.text, opacity: 0.6 }}>
            Clique em um aluno para visualizar os detalhes
          </Typography>
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        {/* Lista de alunos */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: theme.primary }} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredStudents.map((student, index) => (
              <Box
                key={student.student_id || index}
                sx={{
                  width: 180,
                  height: 150,
                  background: theme.primary,
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.15s",
                  "&:hover": {
                    background: theme.secondary,
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => navigate(`/student/${student.student_id}`)}
              >
                {/* Foto / Inicial */}
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 0.6",
                    background: theme.secondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {student.student_picture ? (
                    <Box
                      component="img"
                      src={getImageSrc(student.student_picture)}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 48, fontWeight: 500, color: theme.background }}>
                      {student.student_name?.[0]?.toUpperCase()}
                    </Typography>
                  )}
                </Box>

                {/* Nome */}
                <Box sx={{ padding: "10px", textAlign: "center" }}>
                  <Typography sx={{ color: theme.background, fontSize: 15, fontWeight: 500 }}>
                    {student.student_name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {!loading && filteredStudents.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 5, color: theme.text, opacity: 0.5 }}>
            {isAdmin
              ? 'Nenhum aluno encontrado. Clique em "Adicionar".'
              : "Nenhum aluno encontrado."}
          </Typography>
        )}
      </Box>
    </LayoutBase>
  );
}

export default StudentsList;