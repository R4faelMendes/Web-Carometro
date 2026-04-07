import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "../../components/whitePag/WhitePag";

function Menu() {
return (
  <Layout>
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h2" sx={{ color: "white" }}>
        Menu
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/register"
        sx={{ borderRadius: "10px", width: 250, height: 45 }}
      >
        Listar Usuário
      </Button>
      <Button
        variant="contained"
        component={Link}
        to="/register"
        sx={{ borderRadius: "10px", width: 250, height: 45 }}
      >
        Listar Turmas
      </Button>
      <Button
        variant="contained"
        component={Link}
        to="/register"
        sx={{ borderRadius: "10px", width: 250, height: 45 }}
      >
        Historico de Ocorrência
      </Button>{" "}
      <Button
        variant="contained"
        component={Link}
        to="/register"
        sx={{ borderRadius: "10px", width: 250, height: 45 }}
      >
        Adicionar Usuário
      </Button>{" "}
    </Container>
    </Layout>
  );
}
export default Menu;