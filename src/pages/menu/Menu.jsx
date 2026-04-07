import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "../../components/whitePag/WhitePag";

function Menu() {
  // 🔥 depois você troca isso pelos dados do backend
  const user = {
    name: "Adriano Cassiano Donisete",
    role: "ADMIN",
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
          {/* LADO ESQUERDO */}
          <Box sx={{ width: "45%" }}>
            {/* USER INFO */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }} />

              <Box>
                <Typography variant="h6">
                  Olá, {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role}
                </Typography>
              </Box>
            </Box>

            {/* BOTÕES */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: "20px",
                  height: 45,
                  backgroundColor: "#2957A4",
                }}
              >
                Listar Usuários
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: "20px",
                  height: 45,
                  backgroundColor: "#2957A4",
                }}
              >
                Listar Turmas
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: "20px",
                  height: 45,
                  backgroundColor: "#2957A4",
                }}
              >
                Histórico de Ocorrências
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: "20px",
                  height: 45,
                  backgroundColor: "#2957A4",
                }}
              >
                Adicionar Usuários
              </Button>
            </Box>
          </Box>

          {/* LINHA DIVISÓRIA */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "#2957A4", width: "2px" }}
          />

          {/* LADO DIREITO (VAZIO) */}
          <Box
            sx={{
              width: "45%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">
              {/* vazio por enquanto */}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default Menu;