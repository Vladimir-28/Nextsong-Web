import { useState } from "react";
import { FaSearch, FaUserPlus, FaCheck } from "react-icons/fa";
import UsersController from "../controller/users.controller";
import EventsController from "../controller/events.controller";

export default function CollaboratorsModal({ show, onClose, event, refresh }) {

    const [users, setUsers] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // normalizador
    const normalize = (text) =>
        (text || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    // obtener iniciales
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    const handleSearch = async (value) => {
        setSearch(value);

        const cleanValue = value.trim();

        if (cleanValue.length < 2) {
            setUsers([]);
            return;
        }

        setLoading(true);

        try {
            const data = await UsersController.search(cleanValue);

            const merged = [...allResults, ...data];

            const unique = merged.filter(
                (user, index, self) =>
                    index === self.findIndex(u => u.id === user.id)
            );

            setAllResults(unique);

            const term = normalize(cleanValue);

            const filtered = unique.filter(user => {
                const name = normalize(user.fullName);
                const email = normalize(user.email);
                return name.includes(term) || email.includes(term);
            });

            setUsers(filtered);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (userId) => {
        if (userId === event.creator?.id) return;

        await EventsController.addCollaborator(event.id, userId);
        refresh();
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content rounded-4">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar colaboradores</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">

                        {/* BUSCADOR */}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <FaSearch />
                            </span>
                            <input
                                className="form-control"
                                placeholder="Buscar por nombre o correo..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {loading && (
                            <p className="text-muted">Buscando usuarios...</p>
                        )}

                        {/* LISTA */}
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>

                            {users.length === 0 && search.length >= 2 && !loading && (
                                <p className="text-muted">No se encontraron usuarios</p>
                            )}

                            {users.map(user => {

                                const isCreator = user.id === event.creator?.id;
                                const alreadyAdded = event.collaborators?.some(c => c.id === user.id);

                                return (
                                    <div
                                        key={user.id}
                                        className="d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    >

                                        {/* IZQUIERDA */}
                                        <div className="d-flex align-items-center gap-2">

                                            {/* AVATAR */}
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "35px",
                                                    height: "35px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#a56d49",
                                                    color: "white",
                                                    fontSize: "14px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {getInitials(user.fullName)}
                                            </div>

                                            {/* INFO */}
                                            <div>
                                                <div className="fw-semibold">{user.fullName}</div>
                                                <small className="text-muted">{user.email}</small>
                                            </div>

                                        </div>

                                        {/* DERECHA */}
                                        {alreadyAdded ? (
                                            <span className="text-success d-flex align-items-center gap-1">
                                                <FaCheck />
                                                <small>Agregado</small>
                                            </span>
                                        ) : (
                                            <button
                                                disabled={isCreator}
                                                className="btn btn-sm text-white"
                                                style={{ backgroundColor: "#a56d49" }}
                                                onClick={() => handleAdd(user.id)}
                                            >
                                                <FaUserPlus />
                                            </button>
                                        )}

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}