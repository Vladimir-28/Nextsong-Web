import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EventsController from "../controller/events.controller";
import SongEventCard from "../components/SongEventCard";
import EventSongsController from "../controller/eventSongs.controller";
import CollaboratorsModal from "../components/CollaboratorsModal";

import ConfirmModal from "../../../../components/ConfirmModal";
import SuccessModal from "../../../../components/SuccessModal";

import { FaTimes, FaUserPlus } from "react-icons/fa";

export default function EventDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [songs, setSongs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
        type: "success"
    });

    const user = JSON.parse(sessionStorage.getItem("user"));

    const getEvent = async () => {
        try {
            const data = await EventsController.findById(id);

            if (!data || !data.id) {
                navigate("/not-found");
                return;
            }

            const isCreator = data.creator?.id === user.id;
            const isAdmin = user.role === "ADMIN";
            const isCollaborator = data.collaborators?.some(c => c.id === user.id);

            if (!isCreator && !isCollaborator && !isAdmin) {
                navigate("/forbidden");
                return;
            }

            setEvent(data);

            const songsData = await EventSongsController.getSongsByEvent(id);
            setSongs(songsData);

        } catch (error) {
            console.error(error);
            navigate("/not-found");
        }
    };

    useEffect(() => {
        getEvent();
    }, []);

    const isCreator = event?.creator?.id === user.id;

    // ABRIR CONFIRM MODAL
    const handleAskDelete = (userId) => {
        setSelectedUserId(userId);
        setShowConfirm(true);
    };

    // ELIMINAR COLABORADOR
    const handleConfirmDelete = async () => {
        try {
            await EventsController.removeCollaborator(event.id, selectedUserId);

            setModalData({
                title: "Colaborador eliminado",
                message: "Se eliminó correctamente del evento",
                type: "success"
            });

            setShowSuccess(true);
            getEvent();

        } catch (error) {
            setModalData({
                title: "Error",
                message: "No se pudo eliminar el colaborador",
                type: "error"
            });

            setShowSuccess(true);
        } finally {
            setShowConfirm(false);
            setSelectedUserId(null);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    const MAX_VISIBLE = 8;
    const visible = event?.collaborators?.slice(0, MAX_VISIBLE) || [];
    const remaining = (event?.collaborators?.length || 0) - MAX_VISIBLE;

    if (!event) {
        return (
            <div className="container mt-4">
                <p className="text-muted">Cargando evento...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center">

                <div>
                    <h4 className="fw-semibold">{event.name}</h4>
                    <p className="text-muted mb-0">{event.eventDate}</p>
                </div>

                {isCreator && (
                    <button
                        className="btn text-white"
                        style={{ backgroundColor: "#a56d49" }}
                        onClick={() => setShowModal(true)}
                    >
                        <FaUserPlus className="me-2" />
                        Colaboradores
                    </button>
                )}

            </div>

            {/* COLABORADORES */}
            <div className="mt-4">

                <h6 className="fw-semibold mb-2">Colaboradores</h6>

                {event.collaborators?.length === 0 ? (
                    <p className="text-muted">No hay colaboradores</p>
                ) : (
                    <div className="d-flex flex-wrap gap-2">

                        {visible.map(col => (
                            <div
                                key={col.id}
                                className="d-flex align-items-center gap-2 px-3 py-2"
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: "20px"
                                }}
                            >

                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "50%",
                                        backgroundColor: "#a56d49",
                                        color: "white",
                                        fontSize: "12px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {getInitials(col.fullName)}
                                </div>

                                <span>{col.fullName}</span>

                                {isCreator && (
                                    <FaTimes
                                        size={12}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleAskDelete(col.id)}
                                    />
                                )}

                            </div>
                        ))}

                        {remaining > 0 && (
                            <div
                                className="px-3 py-2"
                                style={{
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "20px",
                                    cursor: "pointer"
                                }}
                                onClick={() => setShowAll(true)}
                            >
                                +{remaining} más
                            </div>
                        )}

                    </div>
                )}

            </div>

            {/* CANCIONES */}
            <div className="mt-4">

                <h5 className="fw-semibold mb-3">Canciones</h5>

                {songs.length === 0 ? (
                    <div className="alert alert-secondary rounded-4">
                        Este evento no tiene canciones...
                    </div>
                ) : (
                    songs.map(song => (
                        <SongEventCard key={song.id} songEvent={song} />
                    ))
                )}

            </div>

            {/* MODAL AGREGAR */}
            <CollaboratorsModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    getEvent();
                }}
                event={event}
                refresh={getEvent}
            />

            {/* MODAL VER TODOS */}
            {showAll && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content rounded-4">

                            <div className="modal-header">
                                <h5 className="modal-title">Todos los colaboradores</h5>
                                <button className="btn-close" onClick={() => setShowAll(false)}></button>
                            </div>

                            <div className="modal-body">

                                {event.collaborators.map(col => (
                                    <div
                                        key={col.id}
                                        className="d-flex justify-content-between align-items-center mb-2"
                                    >

                                        <div className="d-flex align-items-center gap-2">

                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "35px",
                                                    height: "35px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#a56d49",
                                                    color: "white",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {getInitials(col.fullName)}
                                            </div>

                                            <div>{col.fullName}</div>

                                        </div>

                                        {isCreator && (
                                            <FaTimes
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleAskDelete(col.id)}
                                            />
                                        )}

                                    </div>
                                ))}

                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRM MODAL */}
            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar colaborador"
                message="¿Seguro que deseas eliminar este colaborador del evento?"
            />

            {/* SUCCESS MODAL */}
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