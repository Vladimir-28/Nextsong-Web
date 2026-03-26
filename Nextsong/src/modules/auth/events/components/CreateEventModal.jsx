import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import CreateEventStep1 from "./CreateEventStep1";
import CreateEventStep2 from "./CreateEventStep2";
import EventsController from "../controller/events.controller";
import '../styles/createEvent.css';
import EventSongsController from "../controller/eventSongs.controller";

export default function CreateEventModal({ show, onClose, onUpdated, event }) {

  const user = JSON.parse(sessionStorage.getItem("user"));

  const [step, setStep] = useState(1);

  const [eventData, setEventData] = useState({
    id: null,
    name: "",
    type: "",
    date: "",
    songs: []
  });

  // 🔥 CARGAR DATOS (CREATE vs EDIT)
  useEffect(() => {

    if (event) {
      // 🔥 EDITAR
      setEventData({
        id: event.id, // CLAVE
        name: event.name || "",
        type: event.category || "",
        date: event.eventDate
  ? event.eventDate.split("T")[0]
  : "",
        songs: []
      });
    } else {
      // 🔥 CREAR
      setEventData({
        id: null,
        name: "",
        type: "",
        date: "",
        songs: []
      });
    }

    setStep(1);

  }, [event, show]);

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const updateEventData = (data) => {
    setEventData(prev => ({ ...prev, ...data }));
  };

  // 🔥 CREATE + UPDATE EN UNA SOLA FUNCIÓN
  const saveEvent = async () => {

    try {

      let savedEvent;

      if (eventData.id) {
        // 🔥 UPDATE
        savedEvent = await EventsController.update(eventData.id, {
          name: eventData.name,
          eventDate: eventData.date,
          location: "",
          description: "",
          status: "ACTIVE",
          category: eventData.type
        });

        

        alert("Evento actualizado correctamente");

      } else {
        // 🔥 CREATE
        savedEvent = await EventsController.create(
          {
            name: eventData.name,
             eventDate: eventData.date,
            location: "",
            description: "",
            status: "ACTIVE",
            category: eventData.type
          },
          user.id
        );

        alert("Evento creado correctamente");
      }

      // 🔥 GUARDAR canciones (ambos casos)
      if (eventData.songs.length > 0) {
        await EventSongsController.addSongsToEvent(
          savedEvent.id,
          eventData.songs
        );
      }

      if (onUpdated) onUpdated();

      // 🔥 RESET
      setEventData({
        id: null,
        name: "",
        type: "",
        date: "",
        songs: []
      });

      setStep(1);
      onClose();

    } catch (error) {
      console.error("Error guardando evento:", error);
      alert("Error al guardar evento");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">

      <Modal.Header closeButton>
        <Modal.Title>
          {eventData.id ? "Editar Evento" : "Crear Evento"}
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
            updateEvent={updateEventData}
            nextStep={nextStep}
            onClose={onClose}
          />
        )}

        {step === 2 && (
          <CreateEventStep2
            eventData={eventData}
            updateEvent={updateEventData}
            prevStep={prevStep}
            createEvent={saveEvent} // 🔥 ahora sí correcto
          />
        )}

      </Modal.Body>

    </Modal>
  );
}