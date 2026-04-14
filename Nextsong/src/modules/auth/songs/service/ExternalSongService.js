import { buildApiUrl } from "../../../../services/api";

const EXTERNAL_API_URL = buildApiUrl("/external-songs");

const ExternalSongService = {

    // Búsqueda combinada: MusicBrainz + OpenOpus
    search: async (query) => {
        const response = await fetch(`${EXTERNAL_API_URL}/search?q=${encodeURIComponent(query)}`);
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        return text ? JSON.parse(text) : [];
    },

    // Buscar solo por compositor (música clásica)
    searchByComposer: async (name) => {
        const response = await fetch(`${EXTERNAL_API_URL}/composer?name=${encodeURIComponent(name)}`);
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        return text ? JSON.parse(text) : [];
    },

    // Compositores populares para el explorador clásico
    getPopularComposers: async () => {
        const response = await fetch(`${EXTERNAL_API_URL}/composers/popular`);
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        return text ? JSON.parse(text) : [];
    },

    // Importar canción externa a BD → devuelve Song con ID
    importSong: async (externalSongDTO) => {
        const response = await fetch(`${EXTERNAL_API_URL}/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(externalSongDTO)
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        return text ? JSON.parse(text) : null;
    },

    // Enriquecer letra de canción ya existente en BD
    enrichLyrics: async (songId) => {
        const response = await fetch(`${EXTERNAL_API_URL}/${songId}/enrich-lyrics`, {
            method: "PATCH"
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        return text ? JSON.parse(text) : null;
    }
};

export default ExternalSongService;
