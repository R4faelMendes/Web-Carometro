import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography, IconButton, TextField, Button, CircularProgress, Avatar
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";

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
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [classInfo, setClassInfo] = useState({
    class_name: "...",
    course_name: "Carregando curso"
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getStudentsByClass(classId);
      const data = response.data?.data || [];

      setStudents(data);

      if (data.length > 0) {
        setClassInfo({
          class_name: data[0].class_name,
          course_name: data[0].course_name
        });
      }
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao carregar alunos." });
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

        {/* HEADER IGUAL TURMAS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {classInfo.class_name} - {classInfo.course_name}
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
                background: "white"
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />
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

        {/* LINHA + TEXTO IGUAL TURMAS */}
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
          filteredStudents.map((student, index) => (
            <Box
              key={student.student_id || index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                gap: 2
              }}
            >
              {/* CARD CINZA IGUAL TURMAS */}
              <Box
                sx={{
                  flex: 1,
                  background: "#eee",
                  borderRadius: "10px",
                  padding: "10px 15px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  "&:hover": {
                    background: "#e0e0e0"
                  }
                }}
                onClick={() =>
                  navigate(`/student-details/${student.student_id || student.id}`)
                }
              >
                <Avatar
                  src={student.photo}
                  sx={{ width: 40, height: 40 }}
                />

                <Typography sx={{ fontWeight: 500 }}>
                  {student.name}
                </Typography>
              </Box>
            </Box>
          ))
        )}

        {!loading && filteredStudents.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 5, color: "gray" }}>
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