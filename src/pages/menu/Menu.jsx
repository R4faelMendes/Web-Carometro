import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../../components/whitePag/WhitePag";

function Menu() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔐 proteção extra (caso entre direto na rota)
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const salas = [
    { id: 1, nome: "Sala 1" },
    { id: 2, nome: "Sala 2" },
    { id: 3, nome: "Sala 3" },
  ];

  // ✅ agora usando user_type
  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
            {/* 👤 USER */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }} />

              <Box>
                <Typography variant="h6">
                  Olá, {user?.name || "Usuário"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.user_type || "Sem cargo"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {isAdmin ? (
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
                salas.map((sala) => (
                  <Button
                    key={sala.id}
                    component={Link}
                    to={`/sala/${sala.id}`}
                    sx={btnStyle}
                  >
                    {sala.nome}
                  </Button>
                ))
              )}

              {/* 🔴 botão logout */}
              <Button
                onClick={logout}
                sx={{
                  ...btnStyle,
                  backgroundColor: "#d32f2f",
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

          <Box sx={{ width: "45%" }}></Box>
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
};

export default Menu;