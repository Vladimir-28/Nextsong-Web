const API_URL = "http://localhost:8080/auth";

export const loginRequest = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Credenciales incorrectas");
    }

    return text ? JSON.parse(text) : {};
};