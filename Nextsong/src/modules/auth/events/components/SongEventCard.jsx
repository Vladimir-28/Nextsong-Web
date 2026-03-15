import { FiTag } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa6";

export default function SongEventCard({ songEvent }) {
    return (

        <div key={songEvent.id} className="card p-3 mb-2 shadow-sm">

            <div className="d-flex align-items-center">

                {/* Número */}
                <div
                    className="d-flex justify-content-center align-items-center me-3"
                    style={{
                        width: "60px",
                        height: "60px",
                        background: "#f1f1f1",
                        borderRadius: "15px",
                        fontWeight: "600",
                        fontSize: "20px"
                    }}
                >
                    {songEvent.id}
                </div>

                {/* Contenido */}
                <div className="flex-grow-1">

                    <strong className="d-block">
                        {songEvent.title}
                    </strong>

                    <small className="text-muted">
                        {songEvent.artist}
                    </small>

                    <div className="d-flex gap-2 mt-2">

                        <span className="badge bg-light text-muted d-flex align-items-center">
                            <FaRegClock size={14} className="me-1"/>
                            {songEvent.bpm} BPM
                        </span>

                        <span className="badge bg-light text-muted d-flex align-items-center">
                            <FiTag size={14} className="me-1"/>
                            {songEvent.tone}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}