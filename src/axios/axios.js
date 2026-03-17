import axios from "axios";

const api = axios.create({
    baseURL:"http://10.89.240.83:5000/carometro",
	headers: {
	'accept':'application/json',
    },
});

const sheets = {
    postLogin: (user) => api.post("/auth/login",user),
    postCadastro: (user) => api.post("/user",user)
}



export default sheets ;