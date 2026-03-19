
import { createSongRequest } from "../service/SongIndependientService";

export const createSong = async (form) => {

    if (!form.title || !form.artist) {
        throw new Error("Título y artista son obligatorios");
    }

    const song = {
        title: form.title,
        author: form.artist,
        duration: form.duration,
        bpm: form.bpm,
        keyTone: form.keyTone,
        status: "ACTIVE" ,
        lyrics: form.lyrics

    };

    return await createSongRequest(song);
};