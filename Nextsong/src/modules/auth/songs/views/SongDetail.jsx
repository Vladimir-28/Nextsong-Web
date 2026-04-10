import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SongsController from "../controller/songs.controller";
import { FaMusic } from "react-icons/fa";

export default function SongDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [song, setSong] = useState(null);

    const getSong = async () => {
        try {
            const data = await SongsController.findById(id);

            // 404 → no existe
            if (!data || !data.id) {
                navigate("/not-found");
                return;
            }

            setSong(data);

        } catch (error) {
            console.error(error);
            navigate("/not-found"); // fallback
        }
    };

    useEffect(() => {
        getSong();
    }, []);

    if (!song) {
        return (
            <div className="container mt-4">
                <p className="text-muted">Cargando canción...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* HEADER */}
            <div className="d-flex align-items-center gap-3 mb-4">

                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "#f3f4f6"
                    }}
                >
                    <FaMusic size={22} color="#a56d49" />
                </div>

                <div>
                    <h4 className="fw-semibold mb-0">{song.title}</h4>
                    <p className="text-muted mb-0">{song.artist}</p>
                </div>

            </div>

            {/* INFO */}
            <div className="card p-3 rounded-4">

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <small className="text-muted">Tonalidad</small>
                        <div>{song.key || "No definida"}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <small className="text-muted">BPM</small>
                        <div>{song.bpm || "No definido"}</div>
                    </div>

                </div>

                {/* LETRA */}
                <div className="mt-3">
                    <small className="text-muted">Letra</small>
                    <div
                        className="mt-2 p-3"
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "10px",
                            whiteSpace: "pre-line"
                        }}
                    >
                        {song.lyrics || "Sin letra disponible"}
                    </div>
                </div>

            </div>

        </div>
    );
}