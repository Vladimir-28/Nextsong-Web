import { buildApiUrl } from "../../../../services/api";

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};

const UserCategoriesController = {};

// Obtener categorías personalizadas del usuario
UserCategoriesController.getByUser = async (userId) => {
    const response = await fetch(buildApiUrl(`/api/user/${userId}/categories`), {
        method: "GET",
        headers
    });
    if (!response.ok) return [];
    return await response.json();
};

// Guardar nueva categoría personalizada
UserCategoriesController.create = async (userId, name) => {
    const response = await fetch(buildApiUrl(`/api/user/${userId}/categories`), {
        method: "POST",
        headers,
        body: JSON.stringify({ name, userId })
    });
    if (!response.ok) throw new Error("Error al guardar categoría");
    return await response.json();
};

export default UserCategoriesController;
