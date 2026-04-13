import { useState } from "react";
import { Modal, Button, Form, Spinner, Badge } from "react-bootstrap";
import { FaSearch, FaDownload, FaMusic, FaBookOpen } from "react-icons/fa";
import ExternalSongService from "../service/ExternalSongService";
import SuccessModal from "../../../../components/SuccessModal";
import CreateIndependentSong from "../views/CreateIndependentSong";

export default function ExternalSongSearchModal({ show, onClose, onImported }) {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(null);
    const [searched, setSearched] = useState(false);
    const [popularComposers, setPopularComposers] = useState([]);
    const [loadingComposers, setLoadingComposers] = useState(false);

    const [modal, setModal] = useState({ show: false, title: "", message: "", type: "" });

    // Estado para abrir el modal de edición tras importar
    const [editSong, setEditSong] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(false);
        try {
            const data = await ExternalSongService.search(query.trim());
            setResults(data);
            setSearched(true);
        } catch (error) {
            setModal({
                show: true,
                title: "Error de búsqueda",
                message: "No se pudo obtener la información",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleLoadComposers = async () => {
        setLoadingComposers(true);
        try {
            const data = await ExternalSongService.getPopularComposers();
            setPopularComposers(data);
        } catch {
            setPopularComposers([]);
        } finally {
            setLoadingComposers(false);
        }
    };

    const handleComposerClick = async (name) => {
        setQuery(name);
        setLoading(true);
        setSearched(false);
        try {
            const data = await ExternalSongService.searchByComposer(name);
            setResults(data);
            setSearched(true);
        } catch {
            setResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (song) => {
        setImporting(song.externalId);
        try {
            const imported = await ExternalSongService.importSong(song);

            // Cerrar el modal de búsqueda y abrir el de edición
            // para que el usuario complete BPM, tonalidad y acordes
            setEditSong(imported);
            setShowEditModal(true);

            if (onImported) onImported(imported);

        } catch (error) {
            setModal({
                show: true,
                title: "Error al importar",
                message: error.message || "No se pudo importar la canción",
                type: "error"
            });
        } finally {
            setImporting(null);
        }
    };

    const handleClose = () => {
        setQuery("");
        setResults([]);
        setSearched(false);
        setPopularComposers([]);
        onClose();
    };

    const sourceLabel = (source) => {
        if (source === "musicbrainz") return { text: "Popular", color: "#a56d49" };
        if (source === "openopus") return { text: "Clásica", color: "#5b7fa6" };
        return { text: source, color: "#888" };
    };

    const getMissingFieldsText = (song) => {
        if (!Array.isArray(song.missingFields) || song.missingFields.length === 0) {
            return "";
        }

        return song.missingFields.join(", ");
    };

    return (
        <>
            <Modal show={show && !showEditModal} onHide={handleClose} centered size="lg">

                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaSearch className="me-2" style={{ color: "#a56d49" }} />
                        Buscar canciones en catálogos externos
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {/* BUSCADOR */}
                    <div className="input-group mb-3">
                        <Form.Control
                            placeholder="Buscar por título, artista o compositor..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            style={{ backgroundColor: "#a56d49", border: "none" }}
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                        >
                            {loading ? <Spinner size="sm" /> : <FaSearch />}
                        </Button>
                    </div>

                    {/* COMPOSITORES POPULARES */}
                    <div className="mb-3">
                        <button
                            className="btn btn-link p-0 text-decoration-none"
                            style={{ color: "#5b7fa6", fontSize: "13px" }}
                            onClick={handleLoadComposers}
                            disabled={loadingComposers}
                        >
                            <FaBookOpen className="me-1" />
                            {loadingComposers ? "Cargando..." : "Ver compositores clásicos populares"}
                        </button>

                        {popularComposers.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {popularComposers.slice(0, 15).map((name, i) => (
                                    <Badge
                                        key={i}
                                        pill
                                        onClick={() => handleComposerClick(name)}
                                        style={{
                                            backgroundColor: "#e8ddd5",
                                            color: "#5b3a29",
                                            cursor: "pointer",
                                            fontWeight: "normal",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RESULTADOS */}
                    {loading && (
                        <div className="text-center py-4 text-muted">
                            <Spinner size="sm" className="me-2" />
                            Buscando en catálogos externos...
                        </div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <div className="alert alert-secondary rounded-4 text-center">
                            No se encontraron canciones para "<strong>{query}</strong>"
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                            {results.map((song, i) => {
                                const label = sourceLabel(song.source);
                                const isImporting = importing === song.externalId;
                                const missingFieldsText = getMissingFieldsText(song);
                                const hasLyrics = !!song.lyrics;
                                const hasChords = !!song.chordsAvailable;
                                const canImport = hasLyrics || hasChords;
                                return (
                                    <div
                                        key={i}
                                        className="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-2"
                                        style={{ backgroundColor: "#fafafa" }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "40px", height: "40px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "#f1ece8"
                                                }}
                                            >
                                                <FaMusic style={{ color: "#a56d49" }} />
                                            </div>
                                            <div>
                                                <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                                    {song.title}
                                                </div>
                                                <small className="text-muted">
                                                    {song.author || "Compositor desconocido"}
                                                    {song.duration && ` · ${song.duration}`}
                                                    {song.genre && ` · ${song.genre}`}
                                                </small>
                                                <div className="mt-1">
                                                    <Badge
                                                        pill
                                                        style={{
                                                            backgroundColor: label.color,
                                                            fontSize: "10px"
                                                        }}
                                                    >
                                                        {label.text}
                                                    </Badge>
                                                    {song.chordsAvailable && (
                                                        <Badge
                                                            pill
                                                            bg="info"
                                                            className="ms-2"
                                                            style={{ fontSize: "10px" }}
                                                        >
                                                            Acordes externos
                                                        </Badge>
                                                    )}
                                                    {song.lyrics && (
                                                        <Badge
                                                            pill
                                                            bg="success"
                                                            className="ms-2"
                                                            style={{ fontSize: "10px" }}
                                                        >
                                                            Letra
                                                        </Badge>
                                                    )}
                                                    {canImport && (!hasLyrics || !hasChords) && (
                                                        <Badge
                                                            pill
                                                            bg="warning"
                                                            text="dark"
                                                            className="ms-2"
                                                            style={{ fontSize: "10px" }}
                                                        >
                                                            Incompleta
                                                        </Badge>
                                                    )}
                                                </div>
                                                {song.chordsAvailable && song.chordSourceUrl && (
                                                    <small className="d-block mt-1">
                                                        <a
                                                            href={song.chordSourceUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Ver tabs/acordes externos
                                                        </a>
                                                    </small>
                                                )}
                                                {!canImport && (
                                                    <small className="d-block text-danger mt-1">
                                                        Faltan: {missingFieldsText}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            style={{ backgroundColor: "#a56d49", border: "none", minWidth: "90px" }}
                                            onClick={() => handleImport(song)}
                                            disabled={isImporting || !canImport}
                                            title={!canImport ? `Faltan: ${missingFieldsText}` : "Importar canción"}
                                        >
                                            {isImporting
                                                ? <Spinner size="sm" />
                                                : <><FaDownload className="me-1" />Importar</>
                                            }
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* INFO */}
                    {!searched && !loading && (
                        <div className="text-muted text-center py-3" style={{ fontSize: "13px" }}>
                            Busca canciones en MusicBrainz (popular) y OpenOpus (clásica).<br />
                            Solo podrás importar canciones que ya tengan título, autor, duración, BPM y tonalidad.
                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>

            </Modal>

            {/* Modal de edición que se abre automáticamente tras importar */}
            {showEditModal && editSong && (
                <CreateIndependentSong
                    show={showEditModal}
                    song={editSong}
                    isEdit={true}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditSong(null);
                        handleClose();
                    }}
                />
            )}

            <SuccessModal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ ...modal, show: false })}
            />
        </>
    );
}
