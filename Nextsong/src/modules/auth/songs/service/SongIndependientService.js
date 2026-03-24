const API_URL = "http://localhost:8080/songs";

export const createSongRequest = async (song) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(song)
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text);
    }

    return text ? JSON.parse(text) : {};
};

