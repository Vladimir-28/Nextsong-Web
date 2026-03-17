const API_URL = "http://localhost:8080/event-songs";

const EventSongsController = {

    addSongsToEvent: async (eventId, songs) => {

        const payload = songs.map((song, index) => ({
            songId: song.id,
            songOrder: index + 1
        }));

        const response = await fetch(`${API_URL}/event/${eventId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text);
        }

        return text ? JSON.parse(text) : {};
    },

    getSongsByEvent: async (eventId) => {

        const response = await fetch(`${API_URL}/event/${eventId}`);
    
        const text = await response.text();
    
        if (!response.ok) {
            throw new Error(text);
        }
    
        return text ? JSON.parse(text) : [];
    }

};

export default EventSongsController;