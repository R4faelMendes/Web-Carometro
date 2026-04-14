import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:5000/carometro",
	headers: {
	'accept':'application/json',
    },
});

const sheets = {
    postLogin: (user) => api.post("/auth/login",user),
    postCadastro: (user) => api.post("/user",user),
    getUsers: (user) => api.get("/user",user),
    updateUser: (id, data) => axios.put(`/user/${id}`, data),
    deleteUser: (id) => axios.delete(`/user/${id}`)
}


export default sheets ;