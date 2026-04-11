import { BsTrash, BsChevronRight } from "react-icons/bs";
import { SlMusicToneAlt } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

export default function SongCard({ item, onDelete, onEdit, isAdmin }) {

    const navigate = useNavigate();

    return (
        <div
            className="col-md-4 mb-4"
            onClick={() => navigate(`/songs/${item.id}`)}
            style={{ cursor: "pointer" }}
        >
            <div className="card h-100">

                <div className="card-body">

                    <div className="d-flex justify-content-between">

                        {/* ICONO */}
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "50px",
                                height: "50px",
                                background: "#f1f3f5",
                                borderRadius: "12px"
                            }}
                        >
                            <SlMusicToneAlt size={24} />
                        </div>

                        {/* BOTONES */}
                        <div className="d-flex gap-2">

                            {isAdmin && (
                                <button
                                    className="btn p-0 border-0 bg-transparent text-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                >
                                    <BsTrash />
                                </button>
                            )}

                            <button
                                className="btn p-0 border-0 bg-transparent text-warning"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(item);
                                }}
                            >
                                <FaEdit />
                            </button>

                            <button
                                className="btn p-0 border-0 bg-transparent"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/songs/${item.id}`);
                                }}
                            >
                                <BsChevronRight />
                            </button>

                        </div>
                    </div>

                    <span className="badge bg-light text-dark mt-3">Canción</span>

                    <h6 className="mt-2 mb-0">{item.title}</h6>
                    <small className="text-muted">{item.author}</small>

                    <hr />

                    <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted">Duración</small>
                        <strong className="small">{item.duration || "—"}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted d-flex align-items-center gap-1">
                            <FiActivity size={12} /> BPM
                        </small>
                        <strong className="small">
                            {item.bpm !== null && item.bpm !== undefined && item.bpm !== ""
                                ? item.bpm
                                : "—"}
                        </strong>
                    </div>

                    <div className="d-flex justify-content-between">
                        <small className="text-muted">🎼 Tonalidad</small>
                        <strong className="small">{item.keyTone || "—"}</strong>
                    </div>

                </div>

            </div>
        </div>
    );
}
