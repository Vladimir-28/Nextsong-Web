import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import EventCard from "../components/EventCard";
import EventsController from "../controller/events.controller";

export default function Events() {

    const [events, setEvents] = useState([]);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();


    const getEvents = async () => {
        const data = await EventsController.findAll();
        setEvents(data);
    };

    const openEvent = (event) => {

        if (!event || !event.id) {
            setAlert("⚠️ Este evento ya no existe.");
            return;
        }

        navigate(`/events/${event.id}`);
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h4 className="fw-semibold">Mis Eventos</h4>
                    <p className="text-muted">
                        Selecciona un evento para ver sus canciones
                    </p>
                </div>

                <button
                    className="btn text-white d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "#a56d49" }}
                >
                    <FaPlus className="me-1"/> Crear Evento
                </button>

            </div>

            {alert && (
                <div className="alert alert-warning">
                    {alert}
                </div>
            )}

            <div className="row">

                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => openEvent(event)}
                    />
                ))}

            </div>

        </div>
    );
}