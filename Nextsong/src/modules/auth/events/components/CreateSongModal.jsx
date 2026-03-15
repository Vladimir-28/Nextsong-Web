import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function CreateSongModal({ show, onClose, onCreate }) {

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");

  const handleCreate = () => {

    const newSong = {
      title,
      artist,
      duration,
      bpm,
      key
    };

    onCreate(newSong);
    onClose();
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
            placeholder="Nombre de la canción"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Artista *</Form.Label>
          <Form.Control
            placeholder="Nombre del artista"
            onChange={(e) => setArtist(e.target.value)}
          />
        </Form.Group>

        <div className="row">

          <div className="col-6">
            <Form.Label>Duración</Form.Label>
            <Form.Control
              placeholder="3:30"
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="col-6">
            <Form.Label>Tempo (BPM)</Form.Label>
            <Form.Control
              placeholder="120"
              onChange={(e) => setBpm(e.target.value)}
            />
          </div>

        </div>

        <Form.Group className="mt-3">
          <Form.Label>Tonalidad</Form.Label>
          <Form.Control
            onChange={(e) => setKey(e.target.value)}
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