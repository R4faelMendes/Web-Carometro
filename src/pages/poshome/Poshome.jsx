import { Container, Typography } from "@mui/material";

function Home() {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Typography variant="h2">
        Home
      </Typography>
    </Container>
  );
}

export default Home;