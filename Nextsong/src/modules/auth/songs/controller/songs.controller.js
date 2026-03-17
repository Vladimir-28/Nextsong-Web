const API_URL = "http://localhost:8080/songs";

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
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

SongsController.findAll = async () => {
    const response = await fetch(API_URL);

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text);
    }

    return text ? JSON.parse(text) : [];
}

export default SongsController;