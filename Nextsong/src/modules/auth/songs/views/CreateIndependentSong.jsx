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
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: ""
  });

  useEffect(() => {
    if (song && isEdit) {
      setTitle(song.title || "");
      setArtist(song.author || ""); // 👈 importante
      setDuration(song.duration || "");
      setBpm(song.bpm || "");
      setKeyTone(song.keyTone || "");
      setChords(song.chords || "");
    }
  }, [song, isEdit]);

  const handleSaveSong = async () => {
    // 🔥 VALIDACIÓN CAMPOS VACÍOS
  if (
    !title.trim() ||
    !artist.trim() ||
    !duration.trim() ||
    !bpm || String(bpm).trim() === ""||
    !keyTone.trim() ||
    !chords.trim()
  ) {
    setModal({
      show: true,
      title: "Error",
      message: "Todos los campos son obligatorios",
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
        chords
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
                    value={chords} onChange={(e) => setChords(e.target.value)} />
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

        // 🔥 cerrar el modal principal SOLO en éxito
        if (modal.type === "success") {
          onClose();
        }
      }}
    />
    </>
  );
}