import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createSong } from "../../songs/controller/SongIndependientController";

export default function CreateSongModal({ show, onClose, onCreate }) {

  const [form, setForm] = useState({
    title: "",
    artist: "",
    duration: "",
    bpm: "",
    keyTone: "",
    chords: ""

  });

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {

    try {

      const newSong = await createSong(form);

      if (!newSong || !newSong.id) {
        alert("Error al crear canción");
        return;
      }

      onCreate(newSong);

      setForm({
        title: "",
        artist: "",
        duration: "",
        bpm: "",
        keyTone: "",
        chords:""
      });

      onClose();

    } catch (error) {
      alert(error.message);
    }
  };

  return (

    <Modal show={show} onHide={onClose} centered>

      <Modal.Header closeButton>
        <Modal.Title>Crear nueva canción</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Group className="mb-3">
          <Form.Label>Título *</Form.Label>
          <Form.Control
            value={form.title}
            placeholder="Nombre de la canción"
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Artista *</Form.Label>
          <Form.Control
            value={form.artist}
            placeholder="Nombre del artista"
            onChange={(e) => handleChange("artist", e.target.value)}
          />
        </Form.Group>

        <div className="row">

          <div className="col-6">
            <Form.Label>Duración</Form.Label>
            <Form.Control
              value={form.duration}
              placeholder="3:30"
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>

          <div className="col-6">
            <Form.Label>Tempo (BPM)</Form.Label>
            <Form.Control
              value={form.bpm}
              placeholder="120"
              onChange={(e) => handleChange("bpm", e.target.value)}
            />
          </div>

        </div>

        <Form.Group className="mt-3">
          <Form.Label>Tonalidad</Form.Label>
          <Form.Control
            value={form.keyTone}
            onChange={(e) => handleChange("keyTone", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Letra</Form.Label>
            <Form.Control
                 as="textarea"
                 rows={4}
                 placeholder="Escribe la letra de la canción..."
                 value={form.chords}
                onChange={(e) => handleChange("chords", e.target.value)}
               />
             </Form.Group>

      </Modal.Body>

      <Modal.Footer>

        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          style={{ backgroundColor: "#6b4f3a", border: "none" }}
          onClick={handleCreate}
        >
          Agregar canción
        </Button>

      </Modal.Footer>

    </Modal>
  );
}