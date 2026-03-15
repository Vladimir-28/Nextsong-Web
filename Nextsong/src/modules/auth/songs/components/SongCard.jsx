import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { SlMusicToneAlt } from "react-icons/sl";


export default function SongCard({ item }) {
    const [song, setSong] = useState(item ||
    {
        title: "titulo",
        artist: "artista",
        duration: "0:0"
    }
    )
    return (
        <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">

                <div className="card-body">

                    <div className="d-flex justify-content-between">
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

                        <button className="btn btn-light btn-sm bg-transparent border-0"><FaAngleRight /></button>
                    </div>

                    <span className="badge bg-light text-dark mt-3">Canción</span>

                    <h6 className="mt-2">{song.title}</h6>
                    <small className="text-muted">{song.artist}</small>

                    <hr />

                    <div className="d-flex justify-content-between">
                        <small className="text-muted">Duración</small>
                        <strong>{song.duration}</strong>
                    </div>

                </div>

            </div>
        </div>
    );
}