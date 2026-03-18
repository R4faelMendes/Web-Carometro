import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Introduction() {
  const [open, setOpen] = useState(false);

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>


            <img
              src={logo}
              alt="logo"
              style={{
                width: 80,
                marginTop: 8,
              }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 800 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ color: "white" }}>
            Seja Bem-Vindo ao Carômetro Escolar Inteirativo
          </Typography>

          <Typography variant="h5" sx={{ mt: 2, color: "white" }}>
            → O CEI é um sistema escolar que busca facilitar o trabalho de
            docentes e coordenadores!
          </Typography>

          <Button
            component={Link}
            to="/login"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              height: 50,
              fontSize: 16,
              fontWeight: "bold",
              borderRadius: "15px",
            }}
          >
            É um membro da corporação? Entre aqui
          </Button>
        </Box>
      </Container>

    </>
  );
}

export default Introduction;
