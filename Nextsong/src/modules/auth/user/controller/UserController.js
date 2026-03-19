
export const getUser = async () => {
  const res = await fetch("http://localhost:8080/api/user/me");

  if (!res.ok) {
    throw new Error("Error al obtener usuario");
  }

  return await res.json();
};

export const updateUser = async (user) => {
  const res = await fetch("http://localhost:8080/api/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return await res.json();
};