import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FiMusic } from "react-icons/fi";
import { FaRegCalendarAlt, FaUserFriends, FaChurch, FaBriefcase, FaChevronRight } from "react-icons/fa";
import '../styles/addSongs.css';

export default function CreateEventStep1({ eventData, updateEvent, nextStep, onClose }) {

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  // 🔥 SINCRONIZA DATOS (CLAVE PARA EDITAR)
useEffect(() => {

  if (!eventData) return;

  setName(eventData.name || "");
  setType(eventData.type || "");

  const cleanDate = eventData.date?.includes("T")
    ? eventData.date.split("T")[0]
    : eventData.date || "";

  setDate(cleanDate);

}, [eventData]); // 🔥 volver a usar eventData completo

  const eventTypes = [
    { id: "boda", label: "Boda", icon: <FaUserFriends />, color: "#ff2d55" },
    { id: "misa", label: "Misa", icon: <FaChurch />, color: "#a855f7" },
    { id: "concierto", label: "Concierto", icon: <FiMusic />, color: "#b08968" },
    { id: "ensayo", label: "Ensayo", icon: <FaRegCalendarAlt />, color: "#22c55e" },
    { id: "corporativo", label: "Evento Corporativo", icon: <FaBriefcase />, color: "#f59e0b" }
  ];

  const isValid = name && type && date;

  const handleNext = () => {
    updateEvent({
      name,
      type,
      date
    });

    nextStep();
  };

  return (
    <>
      {/* NOMBRE */}
      <Form.Group className="mb-4">
        <Form.Label>Nombre del evento *</Form.Label>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      {/* TIPO */}
      <Form.Label>Tipo de evento *</Form.Label>

      <div className="row g-3 mb-4 d-flex justify-content-center">

        {eventTypes.map(typeItem => (

          <div className="col-4" key={typeItem.id}>

            <label className="w-100">

              <input
                type="radio"
                checked={type === typeItem.id}
                onChange={() => setType(typeItem.id)}
                hidden
              />

              <div className={`event-card ${type === typeItem.id ? "selected" : ""}`}>

                <div
                  className="event-icon"
                  style={{ backgroundColor: typeItem.color }}
                >
                  {typeItem.icon}
                </div>

                <div className="event-label">
                  {typeItem.label}
                </div>

              </div>

            </label>

          </div>

        ))}

      </div>

      {/* FECHA */}
      <Form.Group>
        <Form.Label>Fecha *</Form.Label>
        <Form.Control
  type="date"
  value={date}
  onChange={(e) => {
    setDate(e.target.value);

    updateEvent({
      date: e.target.value // 🔥 ESTA ES LA CLAVE
    });
  }}
/>
      </Form.Group>

      {/* BOTONES */}
      <div className="d-flex justify-content-end mt-4">

        <Button
          variant="light"
          onClick={onClose}
          className="me-2"
        >
          Cancelar
        </Button>

        <Button
          disabled={!isValid}
          style={{ backgroundColor: "#c6a188" }}
          onClick={handleNext}
        >
          Continuar <FaChevronRight />
        </Button>

      </div>
    </>
  );
}