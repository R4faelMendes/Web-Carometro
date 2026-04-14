import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:5000/carometro",
	headers: {
	'accept':'application/json',
    },
});

const sheets = {
    postLogin: (user) => api.post("/auth/login",user),
    postCadastro: (user) => api.post("/user",user)
}


export default sheets ;