import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import SongsController from "../controller/songs.controller";
import CreateIndependentSong from "./CreateIndependentSong";
import ConfirmModal from "../../../../components/ConfirmModal";
import ExternalSongSearchModal from "../components/ExternalSongSearchModal"; // ✅ NUEVO
import { FaPlus, FaSearch, FaGlobe } from "react-icons/fa";

export default function Songs() {

    const [songs, setSongs] = useState([]);
    const [showModalSong, setShowModalSong] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSong, setSelectedSong] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showExternalSearch, setShowExternalSearch] = useState(false); // ✅ NUEVO

    //  CONFIRM MODAL STATE
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        id: null
    });

    // usuario
    const user = JSON.parse(sessionStorage.getItem("user"));

    const getSongs = async () => {
        try {
            const data = await SongsController.findAll();
            setSongs(data);
        } catch (error) {
            console.error(error);
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
        setConfirmModal({
            show: true,
            id
        });
    };

    // CONFIRMAR DELETE REAL
    const confirmDelete = async () => {
        try {
            await SongsController.delete(confirmModal.id, user.id);
            getSongs();

            setSongs(prev =>
                prev.filter(s => s.id !== confirmModal.id)
            );

        } catch (error) {
            console.error(error);

            alert(error.message);
        }

        setConfirmModal({ show: false, id: null });
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

                {/* ✅ Botones: buscar externa + crear manual */}
                <div className="d-flex gap-2">

                    <button
                        className="btn d-flex align-items-center"
                        style={{ backgroundColor: "#5b7fa6", color: "white" }}
                        onClick={() => setShowExternalSearch(true)}
                    >
                        <FaGlobe className="me-1" /> Buscar en catálogos
                    </button>

                    <button
                        className="btn text-white d-flex align-items-center"
                        style={{ backgroundColor: "#a56d49" }}
                        onClick={() => setShowModalSong(true)}
                    >
                        <FaPlus className="me-1" /> Crear Canción
                    </button>

                </div>

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
                        placeholder="Buscar en mis canciones..."
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
                            isAdmin={user?.role === "ADMIN"}
                        />
                    ))
                )}

            </div>

            <CreateIndependentSong
                show={showModalSong}
                onClose={() => {
                    setShowModalSong(false);
                    getSongs();
                }}
            />

            {showEditModal && (
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

            {/* CONFIRM MODAL DELETE */}
            <ConfirmModal
                show={confirmModal.show}
                title="Eliminar canción"
                message="¿Seguro que quieres eliminar esta canción?"
                onClose={() => setConfirmModal({ show: false, id: null })}
                onConfirm={confirmDelete}
            />

            {/* ✅ NUEVO: modal de búsqueda en catálogos externos */}
            <ExternalSongSearchModal
                show={showExternalSearch}
                onClose={() => setShowExternalSearch(false)}
                onImported={() => getSongs()}
            />

        </div>
    );
}