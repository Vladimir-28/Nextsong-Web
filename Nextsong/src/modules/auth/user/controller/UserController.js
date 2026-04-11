import { buildApiUrl } from "../../../../services/api";

const API_URL = buildApiUrl("/api/user");

export const getUser = async () => {

  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("USER STORAGE:", user);

  // 🔥 FIX: solo validar id
  if (!user || !user.id) {
    throw new Error("No hay sesión activa");
  }

  // 🔥 FIX: mandar id
  const res = await fetch(`${API_URL}/me/${user.id}`);

  if (!res.ok) {
    throw new Error("Error al obtener usuario");
  }

  return await res.json();
};

export const updateUser = async (userData) => {

  const res = await fetch(`${API_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return await res.json();
};
