import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Home() {
  const [open, setOpen] = useState(false);

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              onClick={openSidebar}
              size="large"
              sx={{ ml: -6 }}
            >
              <MenuIcon sx={{ fontSize: 50 }} />
            </IconButton>

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

      <Drawer
        anchor="left"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Box
          sx={{
            width: 250,
            height: "99%",
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: "20px",
          }}
          onClick={closeSidebar}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Sobre" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Home;
