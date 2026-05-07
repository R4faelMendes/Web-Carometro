import {
  Box,
  IconButton,
  Drawer,
  Typography
} from "@mui/material";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import logo from "../../assets/logo.png";
import bg from "../../assets/Image_Background.png";
import { useTheme } from "../colors/Colors";

function LayoutBase({ children }) {
  const [open, setOpen] = useState(false);
  const { toggleTheme, darkMode, theme } = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
        transition: "0.3s ease", // 🔥 animação
      }}
    >
      {/* LOGO */}
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <img src={logo} alt="logo" width={80} />
      </Box>

      {/* ⚙️ BOTÃO */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          background: theme.primary,
          color: "#fff",
          zIndex: 2000, // 🔥 resolve problema de sumir
          "&:hover": {
            transform: "rotate(90deg)",
          },
          transition: "0.3s",
        }}
      >
        <SettingsIcon />
      </IconButton>

      {/* 🚀 DRAWER (PAINEL LATERAL) */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            padding: 3,
            background: theme.background,
            color: theme.text,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h6">Configurações</Typography>

          {/* 🔥 SWITCH CUSTOM */}
          <Box
            onClick={toggleTheme}
            sx={{
              width: "90px",
              height: "45px",
              borderRadius: "25px",
              background: darkMode ? "#333" : "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: darkMode ? "flex-end" : "flex-start",
              padding: "5px",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            <Box
              sx={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.3s",
              }}
            >
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </Box>
          </Box>

          <Typography variant="body2">
            Tema: {darkMode ? "Escuro 🌙" : "Claro ☀️"}
          </Typography>
        </Box>
      </Drawer>

      {/* CONTEÚDO */}
      <Box
        sx={{
          width: "90%",
          minHeight: "85vh",
          background: theme.background,
          color: theme.text,
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          transition: "0.3s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default LayoutBase;