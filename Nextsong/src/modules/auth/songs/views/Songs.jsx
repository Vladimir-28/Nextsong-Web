import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import SongsController from "../controller/songs.controller";
import { FaPlus, FaSearch } from "react-icons/fa";
import CreateIndependentSong from "./CreateIndependentSong";

export default function Songs() {

    const [songs, setSongs] = useState([]);
    const [showModalSong, setShowModalSong] = useState(false);
    const [search, setSearch] = useState("");

    // VALIDACIÓN ADMIN
    const user = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = user?.role === "ADMIN";

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

    // FILTRO
    const filteredSongs = search
        ? songs.filter((song) =>
            song.title?.toLowerCase().includes(search.toLowerCase()) ||
            song.author?.toLowerCase().includes(search.toLowerCase())
        )
        : songs;

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h4>Canciones Independientes</h4>
                    <p className="text-muted">
                        Selecciona una canción para ver sus detalles
                    </p>
                </div>

                {/* SOLO ADMIN */}
                {isAdmin && (
                    <button
                        className="btn text-white d-flex align-items-center"
                        style={{ backgroundColor: "#a56d49" }}
                        onClick={() => setShowModalSong(true)}
                    >
                        <FaPlus className="me-1" /> Crear Canción
                    </button>
                )}

            </div>

            {/* BUSCADOR */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <FaSearch color="#6c757d" />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar canción..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                {filteredSongs.length === 0 ? (
                    <div className="alert alert-secondary rounded-4">
                        <span>
                            {search
                                ? "No se encontraron canciones"
                                : "De momento, no hay registros..."}
                        </span>
                    </div>
                ) : (
                    filteredSongs.map((song, index) => (
                        <SongCard key={index} item={song} />
                    ))
                )}
            </div>

            {/* MODAL SOLO ADMIN */}
            {isAdmin && (
                <CreateIndependentSong
                    show={showModalSong}
                    onClose={() => {
                        setShowModalSong(false);
                        getSongs();
                    }}
                />
            )}

        </div>
    );
}