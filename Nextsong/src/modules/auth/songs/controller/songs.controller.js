const API_URL = "http://localhost:8080/songs";

const SongsController = {

    findAll: async () => {
        const response = await fetch(API_URL);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(text);
        }

        return text ? JSON.parse(text) : [];
    },

    findById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`);
        const text = await response.text();

        if (!response.ok) {
            return null; 
        }

        return text ? JSON.parse(text) : null;
    },

    create: async (song) => {
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
    },

    update: async (song) => {
        const response = await fetch(`${API_URL}/${song.id}`, {
            method: "PUT",
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
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text);
        }

        return text;
    }

};

export default SongsController;