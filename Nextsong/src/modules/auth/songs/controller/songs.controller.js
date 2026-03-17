const API_URL = "http://localhost:8080/songs";

const SongsController = {

    findAll: async () => {
        const response = await fetch(API_URL);

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text);
        }

        return text ? JSON.parse(text) : [];
    }

};

export default SongsController;