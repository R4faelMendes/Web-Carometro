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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../axios/axios";
import CustomAlert from "../../components/customAlert/CustomAlert";

function Usuarios() {
  const navigate = useNavigate();

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

  // ✅ CORRIGIDO (SUPORTA QUALQUER API)
  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();

      console.log("RESPOSTA:", response.data);

      const rawUsers = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      const formattedUsers = rawUsers.map((user) => ({
        user_id: user.user_id ?? user.id ?? null,
        user_name: user.user_name ?? user.name ?? "Sem nome",
        user_email: user.user_email ?? user.email ?? "",
        user_type: user.user_type ?? user.type ?? "regular",
      }));

      console.log("FORMATADOS:", formattedUsers);

      setUsers(formattedUsers);
    } catch (error) {
      console.log(error.response?.data);

      setAlert({
        show: true,
        type: "error",
        message: "Erro ao buscar usuários",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserId = (user) => {
    if (!user) return null;
    return user.user_id ?? user.id ?? null;
  };

  const toggleUserType = async (user) => {
    if (!user) return;

    try {
      const newType = user.user_type === "admin" ? "regular" : "admin";

      await api.updateUser(getUserId(user), {
        user_name: user.user_name || "",
        user_email: user.user_email || "",
        user_type: newType,
      });

      setAlert({
        show: true,
        type: "success",
        message: "Tipo de usuário atualizado!",
      });

      fetchUsers();
    } catch (error) {
      console.log(error.response?.data);

      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "Erro ao atualizar tipo de usuário",
      });
    }
  };

  const handleEdit = (user) => {
    if (!user) return;

    console.log("EDITANDO:", user);

    setSelectedUser({ ...user });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!selectedUser) return;

    try {
      await api.updateUser(getUserId(selectedUser), {
        user_name: selectedUser.user_name || "",
        user_email: selectedUser.user_email || "",
        user_type: selectedUser.user_type || "regular",
      });

      setOpenEdit(false);

      setAlert({
        show: true,
        type: "success",
        message: "Usuário atualizado com sucesso!",
      });

      fetchUsers();
    } catch (error) {
      console.log(error.response?.data);

      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao editar usuário",
      });
    }
  };

  const handleDelete = (user) => {
    if (!user) return;

    console.log("DELETANDO:", user);

    setSelectedUser(user);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.deleteUser(getUserId(selectedUser));

      setOpenDelete(false);

      setAlert({
        show: true,
        type: "success",
        message: "Usuário excluído com sucesso!",
      });

      fetchUsers();
    } catch (error) {
      console.log(error.response?.data);

      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Erro ao deletar usuário",
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user?.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
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
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Usuários Cadastrados
            </Typography>
          </Box>

          <TextField
            placeholder="Pesquisar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              maxHeight: "45px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "45px",
                background: "white",
              },
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

        <Box sx={{ borderTop: "2px solid black", pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Clique na turma para visualizar os alunos
          </Typography>
        </Box>

        {filteredUsers.map((user, index) => (
          <Box
            key={getUserId(user) || index}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                background: "#eee",
                borderRadius: "10px",
                padding: "12px 20px",
              }}
            >
              {user.user_name}
            </Box>

            <Box
              onClick={() => toggleUserType(user)}
              sx={{
                width: 70,
                height: 35,
                borderRadius: "20px",
                background:
                  user.user_type === "admin" ? "#111" : "#1976d2",
                display: "flex",
                alignItems: "center",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "white",
                  transform:
                    user.user_type === "admin"
                      ? "translateX(35px)"
                      : "translateX(0px)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={() => handleEdit(user)}>
                <Edit sx={{ color: "#c9b037" }} />
              </IconButton>

              <IconButton onClick={() => handleDelete(user)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={selectedUser?.user_name || ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                user_name: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={saveEdit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutBase>
  );
}

export default Usuarios;