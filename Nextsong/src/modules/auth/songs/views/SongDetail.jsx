import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiClock, FiMusic, FiActivity } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import SongsController from "../controller/songs.controller";
import CreateIndependentSong from "./CreateIndependentSong";
import ChordDiagrams from "../components/ChordDiagrams";

export default function SongDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [song, setSong] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const loadSong = async () => {
        try {
            const data = await SongsController.findById(id);

            if (!data || !data.id) {
                navigate("/not-found");
                return;
            }

            setSong(data);

        } catch (error) {
            console.error(error);
            navigate("/not-found");
        }
    };

    useEffect(() => {
        loadSong();
    }, [id]);

    if (!song) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <p className="text-muted">Cargando...</p>
            </div>
        );
    }

    const statusColor = song.status === "ACTIVE" ? "success" : "secondary";
    const externalChordLink = song.notes?.match(/https?:\/\/\S+/)?.[0] || null;
    const hasLyrics = Boolean(song.lyrics?.trim());
    const hasChords = Boolean(song.chords?.trim());
    const hasChordContent = hasChords || Boolean(externalChordLink);

    return (
        <>
            <div
                className="d-flex justify-content-center align-items-start p-4"
                style={{ minHeight: "100vh", background: "#ffff" }}
            >
                <div
                    className="card border p-4"
                    style={{
                        width: "100%",
                        maxWidth: "900px",
                        borderRadius: "20px",
                    }}
                >
                    {/* HEADER */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-inline-flex align-items-center justify-content-center"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "15px",
                                    background: "#e9ecef",
                                    flexShrink: 0
                                }}
                            >
                                <FiMusic size={28} />
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0">{song.title}</h4>
                                <p className="text-muted mb-0">{song.author}</p>
                            </div>
                        </div>

                       
                    </div>

                    <div className="row g-4">

                        {/* COLUMNA INFO */}
                        <div className="col-md-5">

                            <h6 className="text-muted fw-semibold mb-3">Información</h6>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted d-flex align-items-center gap-1">
                                    <FiClock /> Duración
                                </span>
                                <strong>{song.duration || "—"}</strong>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted d-flex align-items-center gap-1">
                                    <FiActivity /> BPM
                                </span>
                                <strong>
                                    {song.bpm !== null && song.bpm !== undefined && song.bpm !== ""
                                        ? song.bpm
                                        : "—"}
                                </strong>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">🎼 Tonalidad</span>
                                <strong>{song.keyTone || "—"}</strong>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">Estado</span>
                                <span className={`badge bg-${statusColor} px-3 py-2`}>
                                    {song.status}
                                </span>
                            </div>
                        </div>

                        {/* COLUMNA ACORDES/LETRA */}
                        <div className="col-md-7">
                            <h6 className="text-muted fw-semibold mb-3">Contenido musical</h6>

                            {hasChordContent && (
                                <div className={hasLyrics ? "mb-4" : ""}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">Acordes</h6>
                                    </div>

                                    {hasChords && (
                                        <div
                                            style={{
                                                maxHeight: "220px",
                                                overflowY: "auto",
                                                background: "#f8f9fa",
                                                padding: "14px",
                                                borderRadius: "10px",
                                                lineHeight: "1.7",
                                                fontSize: "14px",
                                                whiteSpace: "pre-wrap",
                                                fontFamily: "monospace"
                                            }}
                                        >
                                            {song.chords}
                                        </div>
                                    )}

                                    {externalChordLink && (
                                        <div className={hasChords ? "mt-3" : ""}>
                                            <a href={externalChordLink} target="_blank" rel="noreferrer">
                                                Abrir fuente externa de acordes
                                            </a>
                                        </div>
                                    )}

                                    {hasChords && <ChordDiagrams chords={song.chords} />}
                                </div>
                            )}

                            {hasLyrics && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">Letra</h6>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "260px",
                                            overflowY: "auto",
                                            background: "#f8f9fa",
                                            padding: "14px",
                                            borderRadius: "10px",
                                            lineHeight: "1.7",
                                            fontSize: "14px",
                                            whiteSpace: "pre-wrap"
                                        }}
                                    >
                                        {song.lyrics}
                                    </div>
                                </div>
                            )}

                            {!hasLyrics && !hasChordContent && (
                                <div className="text-muted fst-italic">
                                    Sin letra ni acordes disponibles
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL DE EDICIÓN */}
            {showEditModal && (
                <CreateIndependentSong
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        loadSong(); // recargar datos actualizados
                    }}
                    song={song}
                    isEdit={true}
                />
            )}
        </>
    );
}
