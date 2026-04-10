import { Modal, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function SuccessModal({ show, onClose, title, message, type = "success" }) {

  const isError = type === "error";

  return (
    <Modal show={show} onHide={onClose} centered contentClassName="rounded-4">
      
      {/* ❌ Quitamos Header completamente */}
      
      <Modal.Body className="text-center p-4">

        {/* 🔥 ICONO */}
        <div
          className="d-flex justify-content-center align-items-center mx-auto mb-3 rounded-circle"
          style={{
            width: 80,
            height: 80,
            backgroundColor: isError ? "#f8d7da" : "#d1e7dd"
          }}
        >
          {isError ? (
            <FaTimes size={35} color="#842029" />
          ) : (
            <FaCheck size={35} color="#0f5132" />
          )}
        </div>

        {/* 🔥 TÍTULO */}
        <h4 className="fw-bold mb-2">
          {title || (isError ? "Ocurrió un error" : "¡Bienvenido de nuevo!")}
        </h4>

        {/* 🔥 MENSAJE */}
        <p className="text-muted mb-4">
          {message || "Has iniciado sesión correctamente."}
        </p>

        {/* 🔥 BOTÓN */}
        <Button
          onClick={onClose}
          style={{
            backgroundColor: "#9c6b4f",
            border: "none",
            width: "100%",
            padding: "10px",
            borderRadius: "10px"
          }}
        >
          Entendido
        </Button>

      </Modal.Body>

    </Modal>
  );
}