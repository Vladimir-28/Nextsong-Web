import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import EventCard from "../components/EventCard";
import EventsController from "../controller/events.controller";
import CreateEventModal from "../components/CreateEventModal";

export default function Events() {

    const [events, setEvents] = useState([]);
    const [alert, setAlert] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    // usuario
    const user = JSON.parse(sessionStorage.getItem("user"));

    const isAdmin = user?.role === 'ADMIN';

    const getEvents = async () => {
        const data = await EventsController.findByUser(user.id);
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

    // ELIMINAR EVENTO
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("¿Seguro que quieres eliminar este evento?");
        if (!confirmDelete) return;

        try {
            await EventsController.delete(id);

            // actualizar lista sin recargar
            setEvents(prev => prev.filter(e => e.id !== id));

        } catch (error) {
            console.error(error);
            setAlert("❌ Error al eliminar el evento");
        }
    };

    const filteredEvents = events.filter((event) =>
        event.name?.toLowerCase().includes(search.toLowerCase()) ||
        event.eventDate?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h4 className="fw-semibold">Mis Eventos</h4>
                    <p className="text-muted">
                        Selecciona un evento para ver sus canciones
                    </p>
                </div>

                {/* BOTÓN SOLO ADMIN */}
                {isAdmin && (
                    <button
                        className="btn text-white d-flex justify-content-center align-items-center"
                        style={{ backgroundColor: "#a56d49" }}
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus className="me-1" /> Crear Evento
                    </button>
                )}

            </div>

            {/* BUSCADOR */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <FaSearch color="#6c757d" />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar evento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {alert && (
                <div className="alert alert-warning">
                    {alert}
                </div>
            )}

            <div className="row">

                {filteredEvents.length === 0 ? (

                    <div className="col-12 text-center py-5">

                        <div className="text-muted">

                            <h5 className="mb-2">Aún no hay eventos</h5>

                            <p className="mb-3">
                                Crea tu primer evento para comenzar a organizar canciones.
                            </p>

                            {isAdmin && (
                                <button
                                    className="btn text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                    onClick={() => setShowModal(true)}
                                >
                                    <FaPlus className="me-2" />
                                    Crear primer evento
                                </button>
                            )}

                        </div>

                    </div>

                ) : (

                    filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            user={user} 
                            onClick={() => openEvent(event)}
                            onDelete={handleDelete} 
                        />
                    ))

                )}

            </div>

            {/* MODAL SOLO ADMIN */}
            {isAdmin && (
                <CreateEventModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onCreated={getEvents}
                />
            )}

        </div>
    );
}