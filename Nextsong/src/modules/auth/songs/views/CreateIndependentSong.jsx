import { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import SongsController from "../controller/songs.controller";

export default function CreateIndependentSong({ show, onClose, song, isEdit }) {

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [bpm, setBpm] = useState("");
  const [keyTone, setKeyTone] = useState("");
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    if (song && isEdit) {
      setTitle(song.title || "");
      setArtist(song.author || ""); // 👈 importante
      setDuration(song.duration || "");
      setBpm(song.bpm || "");
      setKeyTone(song.keyTone || "");
      setLyrics(song.lyrics || "");
    }
  }, [song, isEdit]);

  const handleSaveSong = async () => {
    try {

      const payload = {
        id: song?.id,
        title,
        author: artist,
        duration,
        bpm,
        keyTone,
        status: "ACTIVE",
        lyrics
      };

      if (isEdit) {
        await SongsController.update(payload);
        alert("Canción actualizada");
      } else {
        await SongsController.create(payload);
        alert("Canción creada");
      }

      // limpiar
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

            <div className="modal-header">
              <h5 className="fw-bold mb-0">
                {isEdit ? "Editar Canción" : "Crear Canción Independiente"}
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">

              <div className="row g-3">

                <div className="col-md-6">
                  <input className="form-control" placeholder="Título"
                    value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="col-md-6">
                  <input className="form-control" placeholder="Artista"
                    value={artist} onChange={(e) => setArtist(e.target.value)} />
                </div>

                <div className="col-md-6">
                  <input className="form-control" placeholder="Duración"
                    value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>

                <div className="col-md-6">
                  <input className="form-control" placeholder="BPM"
                    value={bpm} onChange={(e) => setBpm(e.target.value)} />
                </div>

                <div className="col-md-6">
                  <input className="form-control" placeholder="Tonalidad"
                    value={keyTone} onChange={(e) => setKeyTone(e.target.value)} />
                </div>

                <div className="col-12">
                  <textarea className="form-control" placeholder="Letra"
                    value={lyrics} onChange={(e) => setLyrics(e.target.value)} />
                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>

              <button
                className="btn text-white"
                onClick={handleSaveSong}
                style={{ backgroundColor: "#cbb2a1" }}
              >
                {isEdit ? "Actualizar" : "Agregar"}
                <BsChevronRight className="ms-1" />
              </button>

            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}