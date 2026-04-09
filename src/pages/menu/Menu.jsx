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
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                {user.name ? user.name[0] : "U"}
              </Avatar>

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
              <Button variant="contained" component={Link} to="/register" sx={{borderRadius: "15px"}}>
                Listar Usuários
              </Button>

              <Button variant="contained" component={Link} to="/register" sx={{borderRadius: "15px"}}>
                Listar Turmas
              </Button>

              <Button variant="contained" component={Link} to="/register" sx={{borderRadius: "15px"}}>
                Histórico de Ocorrências
              </Button>

              <Button variant="contained" component={Link} to="/register" sx={{borderRadius: "15px"}}>
                Adicionar Usuários
              </Button>
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
            <Typography color="text.secondary">
              {/* futuro histórico */}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default Menu;