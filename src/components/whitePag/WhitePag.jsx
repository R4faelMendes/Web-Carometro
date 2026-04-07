import { Box } from "@mui/material";
import logo from "../../assets/logo.png";

function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: 70,
          backgroundColor: "#2957A4",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 2,
        }}
      >
        <img src={logo} alt="logo" width={80} />
      </Box>

      {/* CONTEÚDO */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          height: 50,
          backgroundColor: "#2957A4",
        }}
      />
    </Box>
  );
}

export default Layout;