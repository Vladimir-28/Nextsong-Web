import { buildApiUrl } from "../../../../services/api";

const API_URL = buildApiUrl("/event-songs");

const EventSongsController = {

    // agregar canciones a evento
    addSongsToEvent: async (eventId, songs) => {

        const payload = songs.map((song, index) => ({
            songId: song.id,
            songOrder: index + 1
        }));

        const response = await fetch(`${API_URL}/event/${eventId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "Error al agregar canciones al evento");
        }

        return text ? JSON.parse(text) : {};
    },

    // obtener canciones del evento
    getSongsByEvent: async (eventId) => {

        const response = await fetch(`${API_URL}/event/${eventId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "Error al obtener canciones del evento");
        }

        return text ? JSON.parse(text) : [];
    },



};

export default EventSongsController;
