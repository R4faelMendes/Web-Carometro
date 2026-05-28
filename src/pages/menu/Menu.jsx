import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import LayoutBase from "../../components/layoutBase/LayoutBase";
import api from "../../axios/axios";
import { useTheme } from "../../components/colors/Colors";

function Menu() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  const getImageSrc = (picture) => {
  if (!picture) return undefined;
  if (picture.startsWith('data:') || picture.startsWith('http')) return picture;
  return `data:image/png;base64,${picture}`;
};

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMyClasses = async () => {
      if (!isAdmin && token) {
        setLoading(true);
        try {
          const response = await api.getMyClasses();
          const data = response.data?.data || [];
          setMyClasses(data);
        } catch (error) {
          console.error("Erro ao carregar turmas:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMyClasses();
  }, [isAdmin, token]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (isAdmin && token) {
        setLoadingLogs(true);
        try {
          const response = await api.getAllLogs();
          const data = response.data?.data || [];
          setLogs(data.slice(0, 10));
        } catch (error) {
          console.error("Erro ao carregar logs:", error);
        } finally {
          setLoadingLogs(false);
        }
      }
    };

    fetchLogs();
  }, [isAdmin, token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const btnStyle = {
    borderRadius: "20px",
    height: 45,
    backgroundColor: theme.button2,
    color: theme.background,
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: theme.secondary,
    },
  };

  return (
    <LayoutBase>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Lado esquerdo: perfil + ações */}
          <Box sx={{ width: "45%" }}>
            {/* Perfil do Usuário */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar
                src={getImageSrc(user?.user_picture)}
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  backgroundColor: theme.primary,
                  color: theme.background,
                }}
              >
                {!user?.user_picture && user?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: theme.text }}>
                  Olá, {user?.name || "Usuário"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.text, opacity: 0.6, textTransform: "capitalize" }}
                >
                  {user?.user_type || "Sem cargo"}
                </Typography>
              </Box>
            </Box>

            {/* Menu de Ações */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {isAdmin ? (
                <>
                  <Button component={Link} to="/listusers" sx={btnStyle}>
                    Listar Usuários
                  </Button>

                  <Button component={Link} to="/listclass" sx={btnStyle}>
                    Listar Turmas
                  </Button>

                  <Button component={Link} to="/incidents" sx={btnStyle}>
                    Histórico de Ocorrências
                  </Button>

                  <Button component={Link} to="/register" sx={btnStyle}>
                    Adicionar Usuários
                  </Button>
                </>
              ) : (
                <>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={24} sx={{ color: theme.primary }} />
                    </Box>
                  ) : myClasses.length > 0 ? (
                    myClasses.map((cls) => (
                      <Button
                        key={cls.class_id}
                        component={Link}
                        to={`/class/${cls.class_id}`}
                        sx={btnStyle}
                      >
                        {cls.class_name} - {cls.course_name}
                      </Button>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: theme.text, opacity: 0.5, textAlign: "center" }}
                    >
                      Nenhuma turma vinculada a você.
                    </Typography>
                  )}
                </>
              )}

              {/* Botão Sair */}
              <Button
                onClick={logout}
                sx={{
                  ...btnStyle,
                  backgroundColor: theme.cancel,
                  "&:hover": {
                    filter: "brightness(0.6)",
                    backgroundColor: theme.cancel,
                  },
                }}
              >
                Sair
              </Button>
            </Box>
          </Box>

          {/* Divisor */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: theme.primary, width: "2px" }}
          />

          {/* Lado direito: notificações */}
          <Box
            sx={{
              width: "45%",
              height: "70%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: theme.primary, fontWeight: "bold" }}
            >
              Minhas Notificações
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": { width: "5px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.primary,
                  borderRadius: "10px",
                },
              }}
            >
              {loadingLogs ? (
                <CircularProgress size={20} sx={{ color: theme.primary }} />
              ) : isAdmin ? (
                logs.length > 0 ? (
                  logs.map((log) => (
                    <Box
                      key={log.log_id}
                      sx={{
                        mb: 1.5,
                        p: 1.5,
                        bgcolor: theme.contrast,
                        borderRadius: "10px",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", color: theme.text }}
                      >
                        {log.action_type} em {log.table_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.text }}>
                        Alvo: {log.target_name || `ID: ${log.target_id}`}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: theme.text, opacity: 0.6 }}
                        >
                          Por: {log.responsible_name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.text, opacity: 0.6 }}
                        >
                          {new Date(log.log_date).toLocaleDateString("pt-BR")}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: theme.text, opacity: 0.5 }}>
                    Nenhuma atividade recente.
                  </Typography>
                )
              ) : (
                <Typography variant="body2" sx={{ color: theme.text, opacity: 0.5 }}>
                  Você não possui notificações
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </LayoutBase>
  );
}

export default Menu;