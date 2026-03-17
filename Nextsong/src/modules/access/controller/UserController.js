
import { registerUser } from "../service/UserService.";

export const handleRegister = async (form) => {

    if (form.password !== form.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
    }

    const user = {
        fullName: form.name, 
        email: form.email,
        password: form.password
    };

    return await registerUser(user);
};