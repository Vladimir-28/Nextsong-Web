import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import SongsController from "../controller/songs.controller";
import { FaPlus } from "react-icons/fa";
import CreateIndependentSong from "./CreateIndependentSong";

export default function Songs() {

    const [songs, setSongs] = useState([]);
    const [showModalSong, setShowModalSong] = useState(false);

    const getSongs = async () => {
        try {
            const data = await SongsController.findAll();
            setSongs(data);
        } catch (error) {
            console.error(error);
            alert("Error al cargar canciones");
        }
    };

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h4>Canciones Independientes</h4>
                    <p className="text-muted">
                        Selecciona una canción para ver sus detalles
                    </p>
                </div>

                <button
                    className="btn text-white d-flex align-items-center"
                    style={{ backgroundColor: "#a56d49" }}
                    onClick={() => setShowModalSong(true)}
                >
                    <FaPlus className="me-1" /> Crear Canción
                </button>

            </div>

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

            {/* MODAL */}
            <CreateIndependentSong
                show={showModalSong}
                onClose={() => {
                    setShowModalSong(false);
                    getSongs(); // 🔥 recarga automática
                }}
            />

        </div>
    );
}