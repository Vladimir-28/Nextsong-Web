import { useState } from "react";
import { Modal } from "react-bootstrap";
import CreateEventStep1 from "./CreateEventStep1";
import CreateEventStep2 from "./CreateEventStep2";
import EventsController from "../controller/events.controller";
import '../styles/createEvent.css';
import EventSongsController from "../controller/eventsongs.controller";

export default function CreateEventModal({ show, onClose, onCreated }) {

  const user = JSON.parse(sessionStorage.getItem("user"));
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
    setEventData(prev => ({ ...prev, ...data }));
  };

  const createEvent = async () => {

    try {

      //  1. Crear evento
      const newEvent = await EventsController.create(
        {
          name: eventData.name,
          eventDate: new Date(eventData.date).toISOString().split("T")[0],
          location: "",
          description: "",
          status: "ACTIVE",
          category: eventData.type
        },
        user.id 
      );

      if (!newEvent || !newEvent.id) {
        console.error("No se creó el evento correctamente");
        return;
      }

      //  2. Agregar canciones (solo si hay)
      if (eventData.songs.length > 0) {
        await EventSongsController.addSongsToEvent(
          newEvent.id,
          eventData.songs
        );
      }

      //  3. refrescar
      if (onCreated) onCreated();

      //  4. reset
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