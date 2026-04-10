import { Modal, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function SuccessModal({ show, onClose, title, message, type = "success" }) {

  const isError = type === "error";

  return (
    <Modal show={show} onHide={onClose} centered>

      <Modal.Header
        closeButton
        className={isError ? "bg-danger text-white" : "bg-success text-white"}
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">

        {/* 🔥 ICONO CIRCULAR */}
        <div
          className={`d-flex justify-content-center align-items-center mx-auto mb-3 rounded-circle ${
            isError ? "bg-danger" : "bg-success"
          }`}
          style={{ width: 80, height: 80 }}
        >
          {isError ? (
            <FaTimes size={35} color="white" />
          ) : (
            <FaCheck size={35} color="white" />
          )}
        </div>

        <h5>{message}</h5>

      </Modal.Body>

      <Modal.Footer>
        <Button
          variant={isError ? "danger" : "success"}
          onClick={onClose}
        >
          Aceptar
        </Button>
      </Modal.Footer>

    </Modal>
  );
}