import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FiMusic } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import SongsController from "../../songs/controller/songs.controller";
import CreateSongModal from "./CreateSongModal";
import '../styles/addSongs.css'

export default function CreateEventStep2({ eventData, updateEvent, prevStep, createEvent }) {

    const [availableSongs, setAvailableSongs] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState(eventData.songs || []);
    const [showSongModal, setShowSongModal] = useState(false);

    const getSongs = async () => {
        const data = await SongsController.findAll();
        setAvailableSongs(data);
    };

    useEffect(() => {
        getSongs();
    }, []);

    /* ---------------------------
       DRAG & DROP
    --------------------------- */

    const handleDragStart = (event, song) => {
        event.dataTransfer.setData("song", JSON.stringify(song));
    };

    const allowDrop = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
    
        const song = JSON.parse(event.dataTransfer.getData("song"));
    
        if (!selectedSongs.find(s => s.id === song.id)) {
            setSelectedSongs([...selectedSongs, song]);
        }
    };

    /* ---------------------------
       AGREGAR / REMOVER
    --------------------------- */

    const addSong = (song) => {
        if (!selectedSongs.find(s => s.id === song.id)) {
            setSelectedSongs([...selectedSongs, song]);
        }
    };

    const removeSong = (index) => {

        const updated = [...selectedSongs];
        updated.splice(index, 1);

        setSelectedSongs(updated);
    };

    const finish = () => {

        updateEvent({ songs: selectedSongs });
        createEvent();
    };

    const handleNewSong = (song) => {

        setAvailableSongs([...availableSongs, song]);
        setSelectedSongs([...selectedSongs, song]);
    };

    /* ---------------------------
       FILTRAR DISPONIBLES
    --------------------------- */

    const filteredSongs = availableSongs.filter(
        song => !selectedSongs.find(s => s.id === song.id)
    );

    return (
        <>

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">

                <h6 className="m-0">
                    {selectedSongs.length} canciones agregadas
                </h6>

                <Button
                    style={{ backgroundColor: "#c6a188", border: "none" }}
                    onClick={() => setShowSongModal(true)}
                >
                    + Crear canción
                </Button>

            </div>

            {/* CANCIONES AGREGADAS */}
            <div
                className="mb-4 p-3 border rounded drop-zone"
                onDrop={handleDrop}
                onDragOver={allowDrop}
            >

                {selectedSongs.length === 0 ? (

                    <div className="text-center text-muted">

                        <FiMusic size={40} />

                        <p className="mt-2">
                            Arrastra canciones aquí
                        </p>

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
                                    {song.artist}
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

            {/* CANCIONES DISPONIBLES */}
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
                            {song.artist}
                        </small>

                    </div>

                    <small>{song.duration}</small>

                </div>

            ))}

            {/* FOOTER */}
            <div className="d-flex justify-content-between mt-4">

                <Button variant="light" onClick={prevStep}>
                    Volver
                </Button>

                <Button
                    style={{ backgroundColor: "#c6a188", border: "none" }}
                    onClick={finish}
                >
                    Crear evento
                </Button>

            </div>

            {/* MODAL CREAR CANCIÓN */}
            <CreateSongModal
                show={showSongModal}
                onClose={() => setShowSongModal(false)}
                onCreate={handleNewSong}
            />

        </>
    );
}