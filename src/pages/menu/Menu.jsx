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

function Menu() {
  const navigate = useNavigate();

  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isAdmin = user?.user_type?.toLowerCase() === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMyClasses = async () => {
      // CORREÇÃO: chamava api.getClassesByUser() que batia em GET /classes (admin only)
      // Agora chama api.getAllClasses() que bate em GET /classes/me (acessível a todos)
      if (!isAdmin && token) {
        setLoading(true);
        try {
          const response = await api.getAllClasses();
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
          <Box sx={{ width: "45%" }}>
            {/* Perfil do Usuário */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                {user?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  Olá, {user?.name || "Usuário"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
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
                      <CircularProgress size={24} />
                    </Box>
                  ) : myClasses.length > 0 ? (
                    myClasses.map((cls) => (
                      <Button
                        key={cls.class_id}
                        component={Link}
                        to={`/classes/${cls.class_id}`}
                        sx={btnStyle}
                      >
                        {cls.class_name} - {cls.course_name}
                      </Button>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="gray"
                      textAlign="center"
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
                  backgroundColor: "#d32f2f",
                  "&:hover": { backgroundColor: "#b71c1c" },
                }}
              >
                Sair
              </Button>
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: "#2957A4", width: "2px" }}
          />

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
              sx={{ mb: 2, color: "#2957A4", fontWeight: "bold" }}
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
                  backgroundColor: "#2957A4",
                  borderRadius: "10px",
                },
              }}
            >
              {loadingLogs ? (
                <CircularProgress size={20} />
              ) : isAdmin ? (
                logs.length > 0 ? (
                  logs.map((log) => (
                    <Box
                      key={log.log_id}
                      sx={{
                        mb: 1.5,
                        p: 1.5,
                        bgcolor: "#f5f5f5",
                        borderRadius: "10px",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {log.action_type} em {log.table_name}
                      </Typography>
                      <Typography variant="body2">
                        Alvo: {log.target_name || `ID: ${log.target_id}`}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Por: {log.responsible_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.log_date).toLocaleDateString("pt-BR")}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="gray">
                    Nenhuma atividade recente.
                  </Typography>
                )
              ) : (
                <Typography variant="body2" color="gray">
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

const btnStyle = {
  borderRadius: "20px",
  height: 45,
  backgroundColor: "#2957A4",
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#1e3f7a",
  },
};

export default Menu;