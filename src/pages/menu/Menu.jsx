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
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 🔥 exemplo de salas (depois você pode puxar da API)
  const salas = [
    { id: 1, nome: "Sala 1" },
    { id: 2, nome: "Sala 2" },
    { id: 3, nome: "Sala 3" },
  ];

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
            {/* 👤 USER INFO */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }} />

              <Box>
                <Typography variant="h6">
                  Olá, {user.name || "Usuário"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role || "Sem cargo"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {user.role === "ADMIN" ? (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/usuarios"
                    sx={btnStyle}
                  >
                    Listar Usuários
                  </Button>

                  <Button
                    variant="contained"
                    component={Link}
                    to="/turmas"
                    sx={btnStyle}
                  >
                    Listar Turmas
                  </Button>

                  <Button
                    variant="contained"
                    component={Link}
                    to="/ocorrencias"
                    sx={btnStyle}
                  >
                    Histórico de Ocorrências
                  </Button>

                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={btnStyle}
                  >
                    Adicionar Usuários
                  </Button>
                </>
              ) : (

                salas.map((sala) => (
                  <Button
                    key={sala.id}
                    variant="contained"
                    component={Link}
                    to={`/sala/${sala.id}`}
                    sx={btnStyle}
                  >
                    {sala.nome}
                  </Button>
                ))
              )}
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "#2957A4", width: "2px" }}
          />

          <Box
            sx={{
              width: "45%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary"></Typography>
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
};

export default Menu;