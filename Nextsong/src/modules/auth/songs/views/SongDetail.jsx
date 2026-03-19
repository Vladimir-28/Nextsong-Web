import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiClock, FiMusic, FiActivity } from "react-icons/fi";

export default function SongDetail() {

    const { id } = useParams();
    const [song, setSong] = useState(null);

    const loadSong = async () => {
        try {
            const response = await fetch(`http://localhost:8080/songs/${id}`);
            const data = await response.json();
            setSong(data);
        } catch (error) {
            console.error(error);
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
                background: "#f5f7fb"
            }}
        >
            <div
                className="card border-0 shadow-lg p-4"
                style={{
                    width: "500px",
                    borderRadius: "20px"
                }}
            >

                {/* HEADER */}
                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center mb-2"
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "15px",
                            background: "#e9ecef"
                        }}
                    >
                        <FiMusic size={28} />
                    </div>

                    <h3 className="fw-bold mb-1">{song.title}</h3>
                    <p className="text-muted">{song.author}</p>
                </div>

                {/* INFO */}
                <div className="mb-3">

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

                <hr />

                {/* LETRA */}
                <div>
                    <p className="text-muted fw-semibold mb-2">Letra</p>

                    <div
                        style={{
                            maxHeight: "200px",
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
    );
}