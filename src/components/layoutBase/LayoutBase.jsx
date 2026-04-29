import { Box } from "@mui/material";
import logo from "../../assets/logo.png";

function LayoutBase({ children }) {
  return (
    <Box
      sx={{
        // minHeight garante que o fundo cubra a tela toda, mas permita crescer
        minHeight: "100vh", 
        width: "100vw",
        backgroundImage: "url('../../assets/Image_Background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Mantém o fundo parado enquanto o conteúdo rola
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0", // Espaçamento extra para o card não colar no topo/fundo ao crescer
      }}
    >
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

      <Box
        sx={{
          width: "90%",
          // MUDANÇA AQUI: minHeight em vez de height
          minHeight: "85vh", 
          height: "auto", // Permite que ele se ajuste ao conteúdo
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          marginBottom: "20px", // Margem para telas pequenas
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default LayoutBase;