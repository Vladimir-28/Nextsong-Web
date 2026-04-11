import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import CreateEventStep1 from "./CreateEventStep1";
import CreateEventStep2 from "./CreateEventStep2";
import EventsController from "../controller/events.controller";
import EventSongsController from "../controller/eventSongs.controller";
import SuccessModal from "../../../../components/SuccessModal";
import '../styles/createEvent.css';

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

  // MODAL STATE
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: ""
  });

  // CARGAR DATOS
  useEffect(() => {

    if (event) {
      setEventData({
        id: event.id,
        name: event.name || "",
        type: event.category || "",
        date: event.eventDate ? event.eventDate.split("T")[0] : "",
        songs: []
      });
    } else {
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

  // GUARDAR EVENTO
  const saveEvent = async () => {

    try {

      let savedEvent;

      if (eventData.id) {
        // UPDATE
        savedEvent = await EventsController.update(eventData.id, {
          name: eventData.name,
          eventDate: eventData.date,
          location: "",
          description: "",
          status: "ACTIVE",
          category: eventData.type
        });

      } else {
        // CREATE
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
      }

      // GUARDAR CANCIONES
      if (eventData.songs.length > 0) {
        await EventSongsController.addSongsToEvent(
          savedEvent.id,
          eventData.songs
        );
      }

      if (onUpdated) onUpdated();

      // MOSTRAR MODAL ÉXITO
      setModal({
        show: true,
        title: "Éxito",
        message: eventData.id
          ? "Evento actualizado correctamente"
          : "Evento creado correctamente",
        type: "success"
      });

    } catch (error) {
      console.error("Error guardando evento:", error);

      setModal({
        show: true,
        title: "Error",
        message: "No se pudo guardar el evento",
        type: "error"
      });
    }
  };

  return (
    <>
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
              createEvent={saveEvent}
            />
          )}

        </Modal.Body>

      </Modal>

      {/* MODAL DE RESULTADO */}
      <SuccessModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => {
          setModal({ ...modal, show: false });

          // SOLO SI TODO SALIÓ BIEN
          if (modal.type === "success") {
            setEventData({
              id: null,
              name: "",
              type: "",
              date: "",
              songs: []
            });

            setStep(1);
            onClose();
          }
        }}
      />
    </>
  );
}