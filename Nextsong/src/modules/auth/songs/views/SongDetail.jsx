import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiClock, FiMusic, FiActivity } from "react-icons/fi";
import SongsController from "../controller/songs.controller";

export default function SongDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [song, setSong] = useState(null);

    const loadSong = async () => {
        try {
            const data = await SongsController.findById(id);

            // 🔴 MISMO patrón que EventDetail
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
    }, []);

    if (!song) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <p className="text-muted">Cargando...</p>
            </div>
        );
    }

    const statusColor = song.status === "ACTIVE" ? "success" : "secondary";

    return (
        <div
            className="d-flex justify-content-center align-items-center p-4"
            style={{
                minHeight: "100vh",
                background: "#ffff"
            }}
        >
            <div
                className="card border p-4"
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    borderRadius: "20px",
                    padding: "30px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                }}
            >
                {/* INFO COLUMN */}
                <div style={{ flex: 1, marginRight: "20px" }}>
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center mb-2"
                            style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "15px",
                                background: "#e9ecef"
                            }}
                        >
                            <FiMusic size={30} />
                        </div>

                        <h3 className="fw-bold mb-1">{song.title}</h3>
                        <p className="text-muted">{song.author}</p>
                    </div>

                    {/* INFO */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                                <FiClock className="me-1" /> Duración
                            </span>
                            <strong>{song.duration}</strong>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                                <FiActivity className="me-1" /> BPM
                            </span>
                            <strong>{song.bpm}</strong>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">🎼 Tonalidad</span>
                            <strong>{song.keyTone}</strong>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Estado</span>
                            <span className={`badge bg-${statusColor} px-3 py-2`}>
                                {song.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* LETRA COLUMN */}
                <div style={{ flex: 1 }}>
                    <div>
                        <p className="text-muted fw-semibold mb-2">Letra</p>

                        <div
                            style={{
                                maxHeight: "300px",
                                overflowY: "auto",
                                background: "#f8f9fa",
                                padding: "12px",
                                borderRadius: "10px",
                                lineHeight: "1.6",
                                fontSize: "14px"
                            }}
                        >
                            {song.lyrics}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}