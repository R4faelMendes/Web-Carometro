import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function StudentsList() {
  const navigate = useNavigate();
  const { classId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const classInfo = {
    class_name: "Sala de Aula",
  };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.getStudentsByClass(classId);
      const data = response.data?.data || [];

      setStudents(data);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Erro ao carregar alunos.",
      });
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter((student) =>
    student.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/menu")}>
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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
                background: "white",
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "gray", mr: 1 }} />
              ),
            }}
          />

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/registerstudent/${classId}`)}
            >
              Adicionar
            </Button>
          )}
        </Box>

        {/* LINHA */}
        <Box sx={{ borderTop: "2px solid black", pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
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

{loading ? (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
    <CircularProgress />
  </Box>
) : (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    {filteredStudents.map((student, index) => (
      <Box
        key={student.student_id || index}
        sx={{
          width: 180,
          height: 150,
          background: "#090178",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "background 0.2s",
          "&:hover": {
            background: "#10108B",
          },
        }}
        onClick={() => navigate(`/student/${student.student_id}`)}
      >
        
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 0.6",
            background: "#1e1ecc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {student.photo ? (
            <Box
              component="img"
              src={student.photo}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: 48,
                fontWeight: 500,
                color: "white",
              }}
            >
              {student.student_name?.[0]?.toUpperCase()}
            </Typography>
          )}
        </Box>

        {/* Nome */}
        <Box sx={{ padding: "10px", textAlign: "center" }}>
          <Typography
            sx={{
              color: "white",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            {student.student_name}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
)}

        {!loading && filteredStudents.length === 0 && (
          <Typography
            sx={{
              textAlign: "center",
              mt: 5,
              color: "gray",
            }}
          >
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