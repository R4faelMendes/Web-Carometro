import { useEffect, useState } from "react";
import LayoutBase from "../../components/layoutBase/LayoutBase";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";
import { useTheme } from "../../components/colors/Colors";

const getAvatarUrl = (name) => {
  const encoded = encodeURIComponent(name?.trim() || "?");
  return `https://ui-avatars.com/api/?name=${encoded}&background=2929E4&color=fff&size=80&bold=true`;
};

function Usuarios() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const getImageSrc = (picture) => {
    if (!picture) return undefined;
    if (picture.startsWith('data:') || picture.startsWith('http')) return picture;
    return `data:image/png;base64,${picture}`;
  };

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      const rawUsers = response.data?.data || [];

      setUsers(
        rawUsers.map((user) => ({
          user_id: user.user_id,
          user_name: user.user_name,
          user_email: user.user_email,
          user_cpf: user.user_cpf,
          user_type: user.user_type,
          user_picture: user.user_picture,
        }))
      );
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao buscar usuários" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserType = async (user) => {
    try {
      const newType = user.user_type === "admin" ? "regular" : "admin";
      await api.updateUser(user.user_id, { user_type: newType });
      setAlert({ show: true, type: "success", message: "Tipo de usuário atualizado!" });
      fetchUsers();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao atualizar tipo",
      });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!selectedUser) return;
    try {
      await api.updateUser(selectedUser.user_id, {
        user_name: selectedUser.user_name,
        user_email: selectedUser.user_email,
      });
      setOpenEdit(false);
      setAlert({ show: true, type: "success", message: "Usuário atualizado com sucesso!" });
      fetchUsers();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao editar usuário",
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await api.resetPassword(selectedUser.user_id);
      setAlert({ show: true, type: "success", message: res.data.message });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "Erro no servidor ao resetar (Verifica o Log do Back-end)",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteUser(selectedUser.user_id);
      setOpenDelete(false);
      setAlert({ show: true, type: "success", message: "Usuário excluído!" });
      fetchUsers();
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao deletar" });
    }
  };

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: theme.primary }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.text }}>
              Usuários Cadastrados
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "45px",
                background: theme.contrast,
                color: theme.text,
                "& fieldset": { borderColor: theme.primary },
                "&:hover fieldset": { borderColor: theme.secondary },
                "&.Mui-focused fieldset": { borderColor: theme.focus },
              },
              "& input": { color: theme.text },
              "& input::placeholder": { color: theme.text, opacity: 0.5 },
            }}
          />
        </Box>

        {alert.show && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <Box sx={{ borderTop: `2px solid ${theme.primary}`, pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: theme.text, opacity: 0.6 }}>
            Administração de contas e acessos
          </Typography>
        </Box>

        {/* Lista de usuários */}
        {users
          .filter((u) => u.user_name.toLowerCase().includes(search.toLowerCase()))
          .map((user) => (
            <Box
              key={user.user_id}
              sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
            >
              <Avatar
                src={user.user_picture || getAvatarUrl(user.user_name)}
                alt={user.user_name}
                sx={{ width: 40, height: 40 }}
              />

              <Box
                sx={{
                  flex: 1,
                  background: theme.contrast,
                  color: theme.text,
                  borderRadius: "10px",
                  padding: "12px 20px",
                }}
              >
                {user.user_name}
              </Box>

              {/* Toggle admin/regular */}
              <Box
                onClick={() => toggleUserType(user)}
                sx={{
                  width: 70,
                  height: 35,
                  borderRadius: "20px",
                  background: user.user_type === "admin" ? theme.secondary : theme.button,
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: theme.background,
                    transform:
                      user.user_type === "admin" ? "translateX(35px)" : "translateX(0px)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Box>

              <IconButton onClick={() => handleEdit(user)}>
                <Edit sx={{ color: "#c9b037" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSelectedUser(user);
                  setOpenDelete(true);
                }}
              >
                <Delete sx={{ color: theme.cancel }} />
              </IconButton>
            </Box>
          ))}
      </Box>

      {/* Modal de Edição */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { background: theme.background, color: theme.text },
        }}
      >
        <DialogTitle sx={{ color: theme.text }}>Editar Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 1 }}>
              <Avatar
                src={selectedUser.user_picture || getAvatarUrl(selectedUser.user_name)}
                alt={selectedUser.user_name}
                sx={{ width: 72, height: 72 }}
              />
            </Box>
          )}

          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={selectedUser?.user_name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, user_name: e.target.value })
            }
            sx={inputStyle(theme)}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={selectedUser?.user_email || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, user_email: e.target.value })
            }
            sx={inputStyle(theme)}
          />

          <TextField
            label="CPF"
            fullWidth
            margin="normal"
            value={selectedUser?.user_cpf || ""}
            disabled
            sx={inputStyle(theme)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: theme.button2,
              color: theme.background,
              "&:hover": { backgroundColor: theme.secondary },
            }}
            onClick={handleResetPassword}
          >
            Resetar Senha (E-mail)
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEdit(false)}
            sx={{ color: theme.cancel }}
          >
            Cancelar
          </Button>
          <Button
            onClick={saveEdit}
            variant="contained"
            sx={{
              backgroundColor: theme.primary,
              color: theme.background,
              "&:hover": { backgroundColor: theme.secondary },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: { background: theme.background, color: theme.text },
        }}
      >
        <DialogTitle sx={{ color: theme.text }}>Confirmar Exclusão</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{ color: theme.text }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{ color: theme.cancel, fontWeight: "bold" }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutBase>
  );
}

const inputStyle = (theme) => ({
  "& .MuiInputLabel-root": { color: theme.text, opacity: 0.7 },
  "& .MuiInputLabel-root.Mui-focused": { color: theme.primary },
  "& .MuiOutlinedInput-root": {
    color: theme.text,
    "& fieldset": { borderColor: theme.primary },
    "&:hover fieldset": { borderColor: theme.secondary },
    "&.Mui-focused fieldset": { borderColor: theme.focus },
  },
  "& .MuiOutlinedInput-root.Mui-disabled": {
    "& fieldset": { borderColor: theme.contrast },
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: theme.text,
    opacity: 0.4,
  },
});

export default Usuarios;