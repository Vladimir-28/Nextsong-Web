import { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import SongsController from "../controller/songs.controller";
import SuccessModal from "../../../../components/SuccessModal";

export default function CreateIndependentSong({ show, onClose, song, isEdit }) {

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [bpm, setBpm] = useState("");
  const [keyTone, setKeyTone] = useState("");
  const [chords, setChords] = useState("");
  const [lyrics, setLyrics] = useState("");

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: ""
  });

  useEffect(() => {
    if (song && isEdit) {
      setTitle(song.title || "");
      setArtist(song.author || "");
      setDuration(song.duration || "");
      setBpm(song.bpm || "");
      setKeyTone(song.keyTone || "");
      setChords(song.chords || "");
      setLyrics(song.lyrics || "");
    }
  }, [song, isEdit]);

  const handleSaveSong = async () => {

    const hasLyrics = lyrics.trim() !== "";
    const hasChords = chords.trim() !== "";

    // VALIDACIÓN
    if (
      !title.trim() ||
      !artist.trim() ||
      !duration.trim() ||
      !bpm || String(bpm).trim() === "" ||
      !keyTone.trim()
    ) {
      setModal({
        show: true,
        title: "Error",
        message: "Todos los campos con * son obligatorios",
        type: "error"
      });
      return;
    }

    if (!hasLyrics && !hasChords) {
      setModal({
        show: true,
        title: "Error",
        message: "Debes agregar letra o acordes",
        type: "error"
      });
      return;
    }

    try {

      const payload = {
        id: song?.id,
        title,
        author: artist,
        duration,
        bpm,
        keyTone,
        status: "ACTIVE",
        chords,
        lyrics
      };

      if (isEdit) {
        await SongsController.update(payload);

        setModal({
          show: true,
          title: "Actualizada",
          message: "La canción se actualizó correctamente",
          type: "success"
        });

      } else {
        await SongsController.create(payload);

        setModal({
          show: true,
          title: "Creada",
          message: "La canción se creó correctamente",
          type: "success"
        });
      }

      // limpiar
      setTitle("");
      setArtist("");
      setDuration("");
      setBpm("");
      setKeyTone("");
      setChords("");
      setLyrics("");

    } catch (error) {
      console.error(error);

      setModal({
        show: true,
        title: "Error",
        message: error.message || "No se pudo guardar la canción",
        type: "error"
      });
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
                  <label className="form-label fw-semibold">
                    Título *
                  </label>
                  <input
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Mercy"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Artista *
                  </label>
                  <input
                    className="form-control"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Ej: Shawn Mendez "
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Duración *
                  </label>
                  <input
                    className="form-control"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ej: 3:45"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    BPM *
                  </label>
                  <input
                    className="form-control"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    type="number"
                    placeholder="Ej: 120"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Tonalidad *
                  </label>
                  <input
                    className="form-control"
                    value={keyTone}
                    onChange={(e) => setKeyTone(e.target.value)}
                    placeholder="Ej: C, Gm, F#"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Acordes
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={chords}
                    onChange={(e) => setChords(e.target.value)}
                    placeholder="Ej: C - G - Am - F"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Letra
                  </label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Ej: You've got a hold of me..."
                  />
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

      <SuccessModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => {
          setModal({ ...modal, show: false });

          if (modal.type === "success") {
            onClose();
          }
        }}
      />
    </>
  );
}