import { useState } from "react";
import { Modal } from "react-bootstrap";
import CreateEventStep1 from "./CreateEventStep1";
import CreateEventStep2 from "./CreateEventStep2";
import EventsController from "../controller/events.controller";
import '../styles/createEvent.css'

export default function CreateEventModal({ show, onClose, onCreated }) {

  const [step, setStep] = useState(1);

  const [eventData, setEventData] = useState({
    name: "",
    type: "",
    date: "",
    songs: []
  });

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const updateEvent = (data) => {
    setEventData({ ...eventData, ...data });
  };

  const createEvent = async () => {

    try {

      // 1️ crear evento
      const newEvent = await EventsController.create({
        name: eventData.name,
        eventDate: eventData.date, 
        location: "",
        description: "",
        status: "ACTIVE",
        category: eventData.type
    });

      // 2️ preparar canciones
      const songsPayload = eventData.songs.map((song, index) => ({
        songId: song.id,
        songOrder: index + 1
      }));

      // 3️ guardar canciones
      await fetch(`http://localhost:8080/event-songs/event/${newEvent.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(songsPayload)
      });

      // 4️ refrescar lista
      if (onCreated) onCreated();

      // 5️ reset
      setEventData({
        name: "",
        type: "",
        date: "",
        songs: []
      });

      setStep(1);
      onClose();

    } catch (error) {
      console.error("Error creando evento:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">

      <Modal.Header closeButton>
        <Modal.Title>
          Crear Nuevo Evento
          <div className="text-muted small">
            {step === 1 && "Paso 1: Información del evento"}
            {step === 2 && "Paso 2: Agregar canciones"}
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {step === 1 && (
          <CreateEventStep1
            eventData={eventData}
            updateEvent={updateEvent}
            nextStep={nextStep}
            onClose={onClose}
          />
        )}

        {step === 2 && (
          <CreateEventStep2
            eventData={eventData}
            updateEvent={updateEvent}
            prevStep={prevStep}
            createEvent={createEvent}
          />
        )}

      </Modal.Body>

    </Modal>
  );
}