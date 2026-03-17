const API_URL = "http://localhost:8080/songs";

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};

const SongsController = {};

// obtener todas las canciones
SongsController.findAll = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers
        });

        return await response.json();
    } catch (error) {
        console.error("Error obteniendo canciones:", error);
        return [];
    }
};

// crear canción
SongsController.create = async (song) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({
                title: song.title,
                author: song.author,
                duration: song.duration,
                bpm: song.bpm,
                keyTone: song.keyTone,
                status: "ACTIVE"
            })
        });

        return await response.json();
    } catch (error) {
        console.error("Error creando canción:", error);
        return null;
    }
};

export default SongsController;