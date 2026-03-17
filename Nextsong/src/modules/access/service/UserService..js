const API_URL = "http://localhost:8080/auth";

export const registerUser = async (user) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    const text = await response.text(); 

    if (!response.ok) {
        throw new Error(text);
    }

    return text ? JSON.parse(text) : {};
};