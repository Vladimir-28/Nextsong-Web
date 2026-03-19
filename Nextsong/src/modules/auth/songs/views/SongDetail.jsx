import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div 
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>

                <div className="text-center mb-3">
                    <h4 className="fw-bold">{song.title}</h4>
                    <p className="text-muted mb-0">{song.author}</p>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Duración</span>
                    <strong>{song.duration}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">BPM</span>
                    <strong>{song.bpm}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tonalidad</span>
                    <strong>{song.keyTone}</strong>
                </div>

                <div className="d-flex justify-content-between">
                    <span className="text-muted">Estado</span>
                    <span className="badge bg-success">
                        {song.status}
                    </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Letra</span>
                    <strong>{song.lyrics}</strong>
                </div>

                

            </div>
        </div>
    );
}