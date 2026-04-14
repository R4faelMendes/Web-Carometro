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

function Usuarios() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserType = async (user) => {
    try {
      const newType = user.user_type === "admin" ? "regular" : "admin";

      await api.put(`/users/${user.id}`, {
        ...user,
        user_type: newType,
      });

      fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar user_type:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/users/${selectedUser.id}`, selectedUser);
      setOpenEdit(false);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}`);
      setOpenDelete(false);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <LayoutBase>
      <Box sx={{ p: 3 }}>
        {/* HEADER CONTAINER */}
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
            <Typography variant="h5" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Turmas Cadastradas
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
                "& fieldset": {
                  borderWidth: "2px",
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />
        </Box>

        {/* TEXTO DE INSTRUÇÃO COM LINHA PRETA ACIMA */}
        <Box
          sx={{
            borderTop: "2px solid black", // Trocado de borderBottom para borderTop
            pt: 1, // Trocado de pb (padding-bottom) para pt (padding-top)
            mb: 4,
            ml: 6, // Alinhado com o início do texto após o ícone de voltar
          }}
        >
          <Typography variant="body2" sx={{ color: "#666" }}>
            Clique na turma para visualizar os alunos
          </Typography>
        </Box>

        {/* LISTA DE USUÁRIOS */}
        {filteredUsers.map((user) => (
          <Box
            key={user.id}
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
                border: "1px solid #ccc",
              }}
            >
              {user.name}
            </Box>

            {/* TOGGLE */}
            <Box
              onClick={() => toggleUserType(user)}
              sx={{
                width: 80,
                height: 40,
                borderRadius: "10px",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  user.user_type === "admin" ? "flex-end" : "flex-start",
                padding: "5px",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: user.user_type === "admin" ? "blue" : "black",
                }}
              />
            </Box>

            {/* AÇÕES */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <IconButton onClick={() => handleEdit(user)}>
                <Edit sx={{ color: "#c9b037" }} />
              </IconButton>

              <IconButton onClick={() => handleDelete(user)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* MODAIS (Mantidos conforme original) */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              value={selectedUser?.name || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  name: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={saveEdit}>Salvar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir {selectedUser?.name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
            <Button color="error" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LayoutBase>
  );
}

export default Usuarios;