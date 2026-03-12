import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import EventCard from "../components/EventCard";
import EventsController from "../controller/events.controller";

export default function Events() {
    const [events, setEvents] = useState([]);
    const getEvents = async () => setEvents(await EventsController.findAll())

    useEffect(() => {
        getEvents();
    }, []);
    return (
        <div className="container">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h4 className="fw-semibold">Mis Eventos</h4>
                    <p className="text-muted">
                        Selecciona un evento para ver sus canciones
                    </p>
                </div>

                <button className="btn text-white d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "#a56d49" }}>
                    <FaPlus className="me-1"/> Crear Evento
                </button>

            </div>

            <div className="row">

                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}

            </div>

        </div>
    );
}