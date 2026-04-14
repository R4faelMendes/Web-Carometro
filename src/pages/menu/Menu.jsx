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
  const user = JSON.parse(localStorage.getItem("user"));

  const salas = [
    { id: 1, nome: "Sala 1" },
    { id: 2, nome: "Sala 2" },
    { id: 3, nome: "Sala 3" },
  ];

  //const isAdmin = user.role?.toLowerCase() === "admin";

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
                  Olá, {user.name || "Usuário"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role || "Sem cargo"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {isAdmin ? (
                <>
                  <Button component={Link} to="/usuarios" sx={btnStyle}>
                    Listar Usuários
                  </Button>

                  <Button component={Link} to="/turmas" sx={btnStyle}>
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