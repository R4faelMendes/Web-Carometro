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

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      const rawUsers = response.data?.data || [];
      
      setUsers(rawUsers.map((user) => ({
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_cpf: user.user_cpf, 
        user_type: user.user_type,
      })));
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Erro ao buscar usuários" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserType = async (user) => {
    try {
      //Operador Ternario
      const newType = user.user_type === "admin" ? "regular" : "admin";

      await api.updateUser(user.user_id, {
        user_type: newType,
      });

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
        message: error.response?.data?.message || "Erro no servidor ao resetar (Verifica o Log do Back-end)" 
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Usuários Cadastrados</Typography>
          </Box>
          <TextField
            placeholder="Pesquisar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "40px", height: "45px", background: "white" } }}
          />
        </Box>

        {alert.show && (
          <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        )}

        <Box sx={{ borderTop: "2px solid black", pt: 1, mb: 4, ml: 6 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>Administração de contas e acessos</Typography>
        </Box>

        {users.filter(u => u.user_name.toLowerCase().includes(search.toLowerCase())).map((user) => (
          <Box key={user.user_id} sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
            <Box sx={{ flex: 1, background: "#eee", borderRadius: "10px", padding: "12px 20px" }}>
              {user.user_name}
            </Box>
            
            <Box
              onClick={() => toggleUserType(user)}
              sx={{
                width: 70, height: 35, borderRadius: "20px",
                background: user.user_type === "admin" ? "#111" : "#1976d2",
                display: "flex", alignItems: "center", padding: "4px", cursor: "pointer",
              }}
            >
              <Box sx={{
                  width: 28, height: 28, borderRadius: "50%", background: "white",
                  transform: user.user_type === "admin" ? "translateX(35px)" : "translateX(0px)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>

            <IconButton onClick={() => handleEdit(user)}><Edit sx={{ color: "#c9b037" }} /></IconButton>
            <IconButton onClick={() => { setSelectedUser(user); setOpenDelete(true); }}><Delete sx={{ color: "red" }} /></IconButton>
          </Box>
        ))}
      </Box>

      {/* Modal de Edição */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <TextField label="Nome" fullWidth margin="normal" value={selectedUser?.user_name || ""} 
            onChange={(e) => setSelectedUser({ ...selectedUser, user_name: e.target.value })} />
          
          <TextField label="Email" fullWidth margin="normal" value={selectedUser?.user_email || ""} 
            onChange={(e) => setSelectedUser({ ...selectedUser, user_email: e.target.value })} />
          
          <TextField label="CPF" fullWidth margin="normal" value={selectedUser?.user_cpf || ""} disabled />

          <Button variant="contained" color="warning" fullWidth sx={{ mt: 2 }} onClick={handleResetPassword}>
            Resetar Senha (E-mail)
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={saveEdit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </LayoutBase>
  );
}

export default Usuarios;