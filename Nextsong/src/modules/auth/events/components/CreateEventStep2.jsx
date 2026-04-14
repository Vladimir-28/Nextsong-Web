import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FiMusic } from "react-icons/fi";
import { FaTrash, FaPlus, FaGlobe } from "react-icons/fa";
import SongsController from "../../songs/controller/songs.controller";
import EventSongsController from "../controller/eventSongs.controller";
import CreateSongModal from "./CreateSongModal";
import ExternalSongSearchModal from "../../songs/components/ExternalSongSearchModal"; // ✅ NUEVO
import '../styles/addSongs.css'
import SuccessModal from "../../../../components/SuccessModal";

export default function CreateEventStep2({
    eventData,
    updateEvent,
    prevStep,
    createEvent
}) {

    const [availableSongs, setAvailableSongs] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [showSongModal, setShowSongModal] = useState(false);
    const [showExternalModal, setShowExternalModal] = useState(false); //  NUEVO

    const [modal, setModal] = useState({
        show: false,
        title: "",
        message: "",
        type: ""
    });

    // cargar canciones disponibles (solo una vez)
    useEffect(() => {
        loadSongs();
    }, []);

    // cargar canciones del evento SOLO UNA VEZ (no en cada cambio)
    useEffect(() => {

        const loadEventSongs = async () => {

            if (eventData?.id) {
                try {
                    const eventSongs = await EventSongsController.getSongsByEvent(eventData.id);
                    const songs = eventSongs.map(es => es.song);
                    setSelectedSongs(songs);

                    // sincronizar con el modal padre
                    updateEvent({ songs });

                } catch (error) {
                    console.error("Error cargando canciones del evento", error);
                }
            } else {
                setSelectedSongs(eventData?.songs || []);
            }
        };

        loadEventSongs();

    }, [eventData?.id]); // SOLO CUANDO CAMBIA EL ID

    const loadSongs = async () => {
        const data = await SongsController.findAll();
        setAvailableSongs(data || []);
    };

    /* ---------------------------
       DRAG & DROP
    --------------------------- */

    const handleDragStart = (event, song) => {
        event.dataTransfer.setData("song", JSON.stringify(song));
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const song = JSON.parse(event.dataTransfer.getData("song"));

        if (!selectedSongs.find(s => s.id === song.id)) {

            const updated = [...selectedSongs, song];

            setSelectedSongs(updated);
            updateEvent({ songs: updated });
        }
    };

    /* ---------------------------
       ACCIONES
    --------------------------- */

    const addSong = (song) => {

        if (!selectedSongs.find(s => s.id === song.id)) {

            const updated = [...selectedSongs, song];

            setSelectedSongs(updated);
            updateEvent({ songs: updated });
        }
    };

    const removeSong = (index) => {

        const updated = selectedSongs.filter((_, i) => i !== index);

        setSelectedSongs(updated);
        updateEvent({ songs: updated });
    };

    const handleNewSong = (song) => {

        if (!song.id) return;

        const updated = [...selectedSongs, song];

        setAvailableSongs(prev => [...prev, song]);
        setSelectedSongs(updated);
        updateEvent({ songs: updated });
    };

    // cuando se importa desde APIs externas, se agrega a disponibles y se refresca
    const handleExternalImport = (importedSong) => {
        if (!importedSong?.id) return;
        setAvailableSongs(prev => {
            const exists = prev.find(s => s.id === importedSong.id);
            return exists ? prev : [...prev, importedSong];
        });
    };

    const finish = () => {

        // VALIDACIÓN
        if (selectedSongs.length === 0) {
            setModal({
                show: true,
                title: "Atención",
                message: "Debes agregar al menos una canción",
                type: "error"
            });
            return;
        }

        // TODO BIEN
        createEvent();
    };

    const filteredSongs = availableSongs.filter(
        song => !selectedSongs.find(s => s.id === song.id)
    );

    return (
        <>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h6 className="m-0">
                    {selectedSongs.length} canciones agregadas
                </h6>

                {/* buscar externa + crear manual */}
                <div className="d-flex gap-2">

                    <Button
                        style={{ backgroundColor: "#5b7fa6", border: "none" }}
                        onClick={() => setShowExternalModal(true)}
                    >
                        <FaGlobe className="me-1" /> Buscar en catálogos
                    </Button>

                    <Button
                        style={{ backgroundColor: "#c6a188", border: "none" }}
                        onClick={() => setShowSongModal(true)}
                    >
                        <FaPlus className="me-1" /> Crear canción
                    </Button>

                </div>

            </div>

            <div
                className="mb-4 p-3 border rounded drop-zone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >

                {selectedSongs.length === 0 ? (
                    <div className="text-center text-muted">
                        <FiMusic size={40} />
                        <p className="mt-2">Arrastra canciones aquí</p>
                    </div>
                ) : (
                    selectedSongs.map((song, index) => (
                        <div
                            key={index}
                            className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded"
                        >
                            <div>
                                <strong>{song.title}</strong>
                                <br />
                                <small className="text-muted">
                                    {song.artist || song.author}
                                </small>
                            </div>
                            <FaTrash
                                style={{ cursor: "pointer" }}
                                onClick={() => removeSong(index)}
                            />
                        </div>
                    ))
                )}

            </div>

            <h6 className="mb-3">Canciones disponibles</h6>

            {filteredSongs.map((song, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, song)}
                    className="border p-2 mb-2 rounded d-flex justify-content-between align-items-center song-card"
                    style={{ cursor: "grab" }}
                    onClick={() => addSong(song)}
                >
                    <div>
                        <strong>{song.title}</strong>
                        <br />
                        <small className="text-muted">
                            {song.artist || song.author}
                        </small>
                    </div>

                    <small>{song.duration}</small>
                </div>
            ))}

            <div className="d-flex justify-content-between mt-4">

                <Button variant="light" onClick={prevStep}>
                    Volver
                </Button>

                <Button
                    style={{ backgroundColor: "#c6a188", border: "none" }}
                    onClick={finish}
                >
                    {eventData?.id ? "Actualizar evento" : "Crear evento"}
                </Button>

            </div>

            <CreateSongModal
                show={showSongModal}
                onClose={() => setShowSongModal(false)}
                onCreate={handleNewSong}
            />

            {/* búsqueda en catálogos externos */}
            <ExternalSongSearchModal
                show={showExternalModal}
                onClose={() => {
                    setShowExternalModal(false);
                    loadSongs(); // refresca canciones disponibles tras importar
                }}
                onImported={handleExternalImport}
            />

            <SuccessModal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ ...modal, show: false })}
            />

        </>
    );
}