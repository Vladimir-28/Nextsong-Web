import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

import { createSong } from "../controller/SongIndependientController";

export default function CreateIndependentSong({ show, onClose }) {

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [bpm, setBpm] = useState("");
  const [keyTone, setKeyTone] = useState("");
  const [lyrics, setLyrics] = useState("");

  const handleCreateSong = async () => {
    try {
      await createSong({
        title,
        artist,
        duration,
        bpm,
        keyTone,
        lyrics
      });

      alert("Canción creada");

      // limpiar formulario
      setTitle("");
      setArtist("");
      setDuration("");
      setBpm("");
      setKeyTone("");
      setLyrics("");

      onClose();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="fw-bold mb-0">Crear Canción Independiente</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: "#ffff",
                  border: "1px solid #fff"
                }}
              >
                <h6 className="fw-bold mb-3">
                  Crear nueva canción
                </h6>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Título *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre de la canción"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Artista *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre del artista"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Duración *</label>
                    <input
                      className="form-control"
                      placeholder="3:30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tempo (BPM) *</label>
                    <input
                      className="form-control"
                      placeholder="120"
                      value={bpm}
                      onChange={(e) => setBpm(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tonalidad *</label>
                    <input
                      className="form-control"
                      value={keyTone}
                      onChange={(e) => setKeyTone(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                   <label className="form-label">Letra *</label>
                <textarea
                 className="form-control"
                 placeholder="Escribe la letra de la canción..."
                 rows={4}
                 value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                />
               </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-between">

              <button
                className="btn btn-light"
                onClick={onClose}
              >
                Volver
              </button>

              <button
                className="btn text-white"
                onClick={handleCreateSong}
                style={{ backgroundColor: "#cbb2a1" }}
              >
                Agregar <BsChevronRight className="ms-1" />
              </button>

            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}