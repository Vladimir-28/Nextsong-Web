import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import SongsController from "../controller/songs.controller";
import CreateIndependentSong from "./CreateIndependentSong";
import { FaPlus, FaSearch, FaEdit } from "react-icons/fa";

export default function Songs() {

    const [songs, setSongs] = useState([]);
    const [showModalSong, setShowModalSong] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSong, setSelectedSong] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Seguro que quieres eliminar esta canción?");

        if (!confirmDelete) return;

        try {
            await SongsController.delete(id);
            getSongs(); // refresca lista
        } catch (error) {
            console.error(error);
            alert("Error al eliminar canción");
        }
    };
    const handleEdit = (song) => {
      setSelectedSong(song);
      setShowEditModal(true);
     };

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
                        <SongCard 
                            key={index} 
                            item={song} 
                            onDelete={handleDelete}
                            onEdit={handleEdit} 
                            isAdmin={isAdmin}
                        />
                    ))
                )}
            </div>

            {isAdmin && (
        <CreateIndependentSong
        show={showModalSong}   // 🔥 CORRECTO
        onClose={() => {
            setShowModalSong(false);
            getSongs();
        }}
            />
        )}

        {isAdmin && showEditModal && (
        <CreateIndependentSong
        show={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedSong(null);
            getSongs();
        }}
        song={selectedSong}
        isEdit={true}
    />
)}
        </div>
    );
}