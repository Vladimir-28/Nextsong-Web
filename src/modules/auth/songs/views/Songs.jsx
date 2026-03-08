import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import SongsController from "../controller/songs.controller";

export default function Songs() {
    const [songs, setSongs] = useState([]);
    const getSongs = async () => setSongs(await SongsController.findAll())

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <div className="container mt-4">

            <h4>Canciones Independientes</h4>
            <p className="text-muted">
                Selecciona una canción para ver sus detalles
            </p>

            <div className="row">
                {songs.length === 0 ? (
                    <div className="alert alert-secondary rounded-4">
                        <span>De momento, no hay registros...</span>
                    </div>
                ) : (
                    songs.map((song, index) => (
                        <SongCard key={index} item={song} />
                    ))
                )}
            </div>

        </div>
    );
}