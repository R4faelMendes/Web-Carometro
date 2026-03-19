import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2
      }}
    >
      <Typography variant="h2" sx={{ color: "white" }}>
        Home
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/register"
        sx={{ borderRadius: "10px" }}
      >
        Ir para Cadastro
      </Button>
    </Container>
  );
}

export default Home;