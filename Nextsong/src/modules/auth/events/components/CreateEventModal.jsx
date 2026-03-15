import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FiMusic } from "react-icons/fi";
import { FaRegCalendarAlt, FaUserFriends, FaChurch, FaBriefcase, FaChevronRight } from "react-icons/fa";
import '../styles/createEvent.css';

export default function CreateEventModal({ show, onClose }) {

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState(null);
  const [eventDate, setEventDate] = useState("");

  const eventTypes = [
    { id: "boda", label: "Boda", icon: <FaUserFriends />, color: "#ff2d55" },
    { id: "misa", label: "Misa", icon: <FaChurch />, color: "#a855f7" },
    { id: "concierto", label: "Concierto", icon: <FiMusic />, color: "#b08968" },
    { id: "ensayo", label: "Ensayo", icon: <FaRegCalendarAlt />, color: "#22c55e" },
    { id: "corporativo", label: "Evento Corporativo", icon: <FaBriefcase />, color: "#f59e0b" }
  ];

  const isValid = eventName && eventType && eventDate;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Crear Nuevo Evento
          <div className="text-muted small">Paso 1: Información del evento</div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* Nombre */}
        <Form.Group className="mb-4">
          <Form.Label>Nombre del evento *</Form.Label>
          <Form.Control
            placeholder="Ej: Boda María & Carlos"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </Form.Group>

        {/* Tipo */}
        <Form.Label>Tipo de evento *</Form.Label>

        <div className="row g-3 mb-4 d-flex justify-content-center">

          {eventTypes.map(type => (
            <div className="col-4" key={type.id}>
              <label className="w-100">

                <input
                  type="radio"
                  name="eventType"
                  value={type.id}
                  checked={eventType === type.id}
                  onChange={() => setEventType(type.id)}
                  hidden
                />

                <div
                  className={`event-card ${eventType === type.id ? "selected" : ""}`}
                >

                  <div
                    className="event-icon"
                    style={{ backgroundColor: type.color }}
                  >
                    {type.icon}
                  </div>

                  <div className="event-label">
                    {type.label}
                  </div>

                </div>

              </label>
            </div>
          ))}

        </div>

        {/* Fecha */}
        <Form.Group>
          <Form.Label>Fecha del evento *</Form.Label>
          <Form.Control
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </Form.Group>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          style={{ backgroundColor: "#c6a188" }}
          className="border-0 d-flex justify-content-center align-items-center"
          disabled={!isValid}
        >
          Continuar <FaChevronRight />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}