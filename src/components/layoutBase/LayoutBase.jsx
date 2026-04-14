import { Box } from "@mui/material";
import logo from "../../assets/logo.png";

function LayoutBase({ children }) {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('../../assets/Image_Background.png')", // coloca sua imagem aqui
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo no canto */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          borderRadius: "15px",

          
        }}
      >
        <img src={logo} alt="logo" width={80} />
      </Box>

      {/* Card branco */}
      <Box
        sx={{
          width: "90%",
          height: "85%",
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default LayoutBase;