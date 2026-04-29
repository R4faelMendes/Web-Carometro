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
import api from "../../axios/axios";

function Menu() {
  const navigate = useNavigate();

  // Estados
  const [myClasses, setMyClasses] = useState([]);
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

  // Buscar TURMAS do usuário (CORRETO)
  useEffect(() => {
    const fetchMyClasses = async () => {
      if (!isAdmin && token) {
        setLoading(true);
        try {
          const response = await api.getClassesByUser(); // ✅ AGORA CERTO
          const data = response.data?.data || [];
          setMyClasses(data);
        } catch (error) {
          console.error("Erro ao carregar turmas:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMyClasses();
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
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                {user?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  Olá, {user?.name || "Usuário"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {user?.user_type || "Sem cargo"}
                </Typography>
              </Box>
            </Box>

            {/* Menu */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {isAdmin ? (
                <>
                  <Button component={Link} to="/listusers" sx={btnStyle}>
                    Listar Usuários
                  </Button>

                  <Button component={Link} to="/listclass" sx={btnStyle}>
                    Listar Turmas
                  </Button>

                  <Button component={Link} to="/incidents" sx={btnStyle}>
                    Histórico de Ocorrências
                  </Button>

                  <Button component={Link} to="/register" sx={btnStyle}>
                    Adicionar Usuários
                  </Button>
                </>
              ) : (
                <>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : myClasses.length > 0 ? (
                    myClasses.map((cls) => (
                      <Button
                        key={cls.class_id}
                        component={Link}
                        to={`/class/${cls.class_id}`} // ✅ IGUAL AO LISTCLASS
                        sx={btnStyle}
                      >
                        {cls.class_name} - {cls.course_name}
                      </Button>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="gray"
                      textAlign="center"
                    >
                      Nenhuma turma vinculada a você.
                    </Typography>
                  )}
                </>
              )}

              {/* Sair */}
              <Button
                onClick={logout}
                sx={{
                  ...btnStyle,
                  backgroundColor: "#d32f2f",
                  "&:hover": { backgroundColor: "#b71c1c" },
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
            {/* Espaço futuro */}
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