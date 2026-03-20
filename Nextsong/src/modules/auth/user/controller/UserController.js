// Función para obtener el perfil del usuario actual
export const getUser = async () => {
  // Obtener el token de autenticación del localStorage (o de donde lo guardes)
  const token = localStorage.getItem("authToken");

  // Si no hay token, lanzar un error
  if (!token) {
    throw new Error("No estás autenticado");
  }

  const res = await fetch("http://localhost:8080/api/user/me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
    },
  });

  // Verificar si la respuesta es exitosa
  if (!res.ok) {
    throw new Error("Error al obtener usuario");
  }

  // Si la solicitud es exitosa, devolver la respuesta en formato JSON
  return await res.json();
};

// Función para actualizar la información del usuario
export const updateUser = async (user) => {
  // Obtener el token de autenticación del localStorage (o de donde lo guardes)
  const token = localStorage.getItem("authToken");

  // Si no hay token, lanzar un error
  if (!token) {
    throw new Error("No estás autenticado");
  }

  const res = await fetch("http://localhost:8080/api/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Especificamos que el cuerpo es JSON
      "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
    },
    body: JSON.stringify(user), // Convertir el objeto 'user' en una cadena JSON
  });

  // Verificar si la respuesta es exitosa
  if (!res.ok) {
    throw new Error("Error al actualizar usuario");
  }

  // Si la solicitud es exitosa, devolver la respuesta en formato JSON
  return await res.json();
};