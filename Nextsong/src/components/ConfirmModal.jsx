import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({
	show,
	onClose,
	onConfirm,
	title = "Confirmar",
	message = "¿Estás seguro?"
}) {

	return (
		<Modal show={show} onHide={onClose} centered>

			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="text-center">
				<p className="mb-0">{message}</p>
			</Modal.Body>

			<Modal.Footer className="d-flex justify-content-center gap-2">

				{/* CANCELAR */}
				<Button
					style={{
						backgroundColor: "#e0e0e0",
						border: "none",
						color: "#333"
					}}
					onClick={onClose}
				>
					Cancelar
				</Button>

				{/* ACEPTAR */}
				<Button
					style={{
						backgroundColor: "#a56d49",
						border: "none",
						color: "white"
					}}
					onClick={onConfirm}
				>
					Aceptar
				</Button>

			</Modal.Footer>

		</Modal>
	);
}