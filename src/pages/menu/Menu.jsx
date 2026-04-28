import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Layout from "../../components/whitePag/WhitePag";
import api from "../../axios/axios"; // Importando nossa configuração da API

function Menu() {
  const navigate = useNavigate();

  // Estados
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Efeito para buscar cursos se o usuário NÃO for admin
  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!isAdmin && token) {
        setLoading(true);
        try {
          // Rota: router.get("/course", verifyJWT, CourseController.readCoursesByIdUser)
          // O ID do usuário o backend pega automaticamente pelo JWT no interceptor
          const response = await api.getCourses(); 
          
          // Ajuste aqui conforme o formato de resposta da sua API
          const data = response.data?.data || response.data || [];
          setMyCourses(data);
        } catch (error) {
          console.error("Erro ao carregar seus cursos:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMyCourses();
  }, [isAdmin, token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "45%" }}>
            {/* Perfil do Usuário */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }} />
              <Box>
                <Typography variant="h6">
                  Olá, {user?.name || "Usuário"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {user?.user_type || "Sem cargo"}
                </Typography>
              </Box>
            </Box>

            {/* Menu de Botões */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {isAdmin ? (
                // --- VISÃO ADMIN ---
                <>
                  <Button component={Link} to="/listusers" sx={btnStyle}>
                    Listar Usuários
                  </Button>
                  <Button component={Link} to="/listclass" sx={btnStyle}>
                    Listar Turmas
                  </Button>
                  <Button component={Link} to="/ocorrencias" sx={btnStyle}>
                    Histórico de Ocorrências
                  </Button>
                  <Button component={Link} to="/register" sx={btnStyle}>
                    Adicionar Usuários
                  </Button>
                </>
              ) : (
                // --- VISÃO USUÁRIO REGULAR (MEUS CURSOS) ---
                <>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : myCourses.length > 0 ? (
                    myCourses.map((curso) => (
                      <Button
                        key={curso.id || curso.course_id}
                        component={Link}
                        to={`/sala/${curso.id || curso.course_id}`}
                        sx={btnStyle}
                      >
                        {curso.name || curso.course_name}
                      </Button>
                    ))
                  ) : (
                    <Typography variant="body2" color="gray" textAlign="center">
                      Nenhum curso vinculado a você.
                    </Typography>
                  )}
                </>
              )}

              {/* Botão Sair */}
              <Button
                onClick={logout}
                sx={{
                  ...btnStyle,
                  backgroundColor: "#d32f2f",
                  "&:hover": { backgroundColor: "#b71c1c" }
                }}
              >
                Sair
              </Button>
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "#2957A4", width: "2px" }}
          />

          <Box sx={{ width: "45%" }}>
            {/* Espaço reservado para futuras informações/imagens */}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

const btnStyle = {
  borderRadius: "20px",
  height: 45,
  backgroundColor: "#2957A4",
  color: "white",
  "&:hover": {
    backgroundColor: "#1e3f7a",
  },
};

export default Menu;