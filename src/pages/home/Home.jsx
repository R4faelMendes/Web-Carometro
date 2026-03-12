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
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/logo.png";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Padding } from "@mui/icons-material";


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
                marginTop: 8
              }}
            />
          </Toolbar>
        </Container>
      </AppBar>

    <Container sx={{ mt: 6, textAlign: "center",color:"White"}}>
        <Typography variant="h3" fontWeight="bold">
          Seja Bem-Vindo ao Carômetro Escolar <br/>Interativo
        </Typography>

        <ArrowForwardIcon />
      </Container>

      <Drawer anchor="left" open={open} onClose={closeSidebar}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            backgroundColor: "primary.main",
            color: "white",
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