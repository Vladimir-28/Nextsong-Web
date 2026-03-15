import { useState } from "react";
import { Modal } from "react-bootstrap";
import CreateEventStep1 from "./CreateEventStep1";
import CreateEventStep2 from "./CreateEventStep2";
import '../styles/createEvent.css'

export default function CreateEventModal({ show, onClose }) {

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

  const createEvent = () => {
    console.log("Evento creado:", eventData);
    onClose();
    setStep(1);
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