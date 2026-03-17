
import { loginRequest } from "../service/LoginService";

export const handleLogin = async (email, password) => {

    if (!email || !password) {
        throw new Error("Todos los campos son obligatorios");
    }

    return await loginRequest({ email, password });
};