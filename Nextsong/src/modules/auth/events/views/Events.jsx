import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import EventCard from "../components/EventCard";
import EventsController from "../controller/events.controller";
import CreateEventModal from "../components/CreateEventModal";
import ConfirmModal from "../../../../components/ConfirmModal";
import SuccessModal from "../../../../components/SuccessModal";

export default function Events() {

    const [events, setEvents] = useState([]);
    const [alert, setAlert] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // 🔥 confirm modal
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        id: null
    });

    // 🔥 success modal
    const [showSuccess, setShowSuccess] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
        type: "success"
    });

    const navigate = useNavigate();

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

    /* =========================
       ELIMINAR EVENTO
    ========================== */

    const handleDelete = (id) => {
        setConfirmModal({
            show: true,
            id
        });
    };

    const confirmDelete = async () => {
        try {
            await EventsController.delete(confirmModal.id);

            setEvents(prev => prev.filter(e => e.id !== confirmModal.id));

            setModalData({
                title: "Evento eliminado",
                message: "El evento se eliminó correctamente",
                type: "success"
            });

            setShowSuccess(true);

        } catch (error) {
            console.error(error);

            setModalData({
                title: "Error",
                message: "No se pudo eliminar el evento",
                type: "error"
            });

            setShowSuccess(true);
        }

        setConfirmModal({ show: false, id: null });
    };

    /* ========================= */

    const filteredEvents = events.filter((event) =>
        event.name?.toLowerCase().includes(search.toLowerCase()) ||
        event.eventDate?.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setShowEditModal(true);
    };

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
                    onClick={() => setShowModal(true)}
                >
                    <FaPlus className="me-1" /> Crear Evento
                </button>

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

                            <button
                                className="btn text-white"
                                style={{ backgroundColor: "#a56d49" }}
                                onClick={() => setShowModal(true)}
                            >
                                <FaPlus className="me-2" />
                                Crear primer evento
                            </button>

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
                            onEdit={handleEdit}
                        />
                    ))

                )}

            </div>

            {/* CREAR EVENTO */}
            <CreateEventModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    getEvents();
                }}
            />

            {/* EDITAR EVENTO */}
            {showEditModal && (
                <CreateEventModal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedEvent(null);
                        getEvents();
                    }}
                    event={selectedEvent}
                    isEdit={true}
                />
            )}

            {/* 🔥 CONFIRM MODAL */}
            <ConfirmModal
                show={confirmModal.show}
                title="Eliminar evento"
                message="¿Seguro que quieres eliminar este evento?"
                onClose={() => setConfirmModal({ show: false, id: null })}
                onConfirm={confirmDelete}
            />

            {/* 🔥 SUCCESS MODAL */}
            <SuccessModal
                show={showSuccess}
                onClose={() => setShowSuccess(false)}
                title={modalData.title}
                message={modalData.message}
                type={modalData.type}
            />

        </div>
    );
}