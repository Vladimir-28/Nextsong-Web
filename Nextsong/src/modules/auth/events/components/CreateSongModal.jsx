import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createSong } from "../../songs/controller/SongIndependientController";
import SuccessModal from "../../../../components/SuccessModal";

export default function CreateSongModal({ show, onClose, onCreate }) {

	const [form, setForm] = useState({
		title: "",
		artist: "",
		duration: "",
		bpm: "",
		keyTone: "",
		chords: "",
		lyrics: ""
	});

	const [modal, setModal] = useState({
		show: false,
		title: "",
		message: "",
		type: ""
	});

	const handleChange = (field, value) => {
		setForm(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleCreate = async () => {

		const hasLyrics = form.lyrics.trim() !== "";
		const hasChords = form.chords.trim() !== "";

		// VALIDACIÓN
		if (
			!form.title.trim() ||
			!form.artist.trim() ||
			!form.duration.trim() ||
			!form.bpm ||
			!form.keyTone.trim()
		) {
			setModal({
				show: true,
				title: "Campos requeridos",
				message: "Todos los campos con * son obligatorios",
				type: "error"
			});
			return;
		}

		if (!hasLyrics && !hasChords) {
			setModal({
				show: true,
				title: "Error",
				message: "Debes agregar letra o acordes",
				type: "error"
			});
			return;
		}

		try {

			
			const payload = {
				...form,
				author: form.artist 
			};

			console.log("ENVIANDO:", payload); // debug

			const newSong = await createSong(payload);

			if (!newSong || !newSong.id) {
				setModal({
					show: true,
					title: "Error",
					message: "No se pudo crear la canción",
					type: "error"
				});
				return;
			}

			onCreate(newSong);

			setModal({
				show: true,
				title: "Éxito",
				message: "Canción creada correctamente",
				type: "success"
			});

			// limpiar formulario
			setForm({
				title: "",
				artist: "",
				duration: "",
				bpm: "",
				keyTone: "",
				chords: "",
				lyrics: ""
			});

		} catch (error) {
			console.error(error);

			setModal({
				show: true,
				title: "Error",
				message: error.message || "Error del servidor",
				type: "error"
			});
		}
	};

	return (
		<>
			<Modal show={show} onHide={onClose} centered>

				<Modal.Header closeButton>
					<Modal.Title>Crear nueva canción</Modal.Title>
				</Modal.Header>

				<Modal.Body>

					<Form.Group className="mb-3">
						<Form.Label>Título *</Form.Label>
						<Form.Control
							value={form.title}
							placeholder="Ej: Mercy"
							onChange={(e) => handleChange("title", e.target.value)}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Artista *</Form.Label>
						<Form.Control
							value={form.artist}
							placeholder="Ej: Shawn Mendes"
							onChange={(e) => handleChange("artist", e.target.value)}
						/>
					</Form.Group>

					<div className="row">

						<div className="col-6">
							<Form.Label>Duración *</Form.Label>
							<Form.Control
								value={form.duration}
								placeholder="Ej: 3:45"
								onChange={(e) => handleChange("duration", e.target.value)}
							/>
						</div>

						<div className="col-6">
							<Form.Label>Tempo (BPM) *</Form.Label>
							<Form.Control
								value={form.bpm}
								placeholder="Ej: 120"
								onChange={(e) => handleChange("bpm", e.target.value)}
							/>
						</div>

					</div>

					<Form.Group className="mt-3">
						<Form.Label>Tonalidad *</Form.Label>
						<Form.Control
							value={form.keyTone}
							onChange={(e) => handleChange("keyTone", e.target.value)}
							placeholder="Ej: C, Gm, F#"
						/>
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>Acordes</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							placeholder="Ej: C - G - Am - F"
							value={form.chords}
							onChange={(e) => handleChange("chords", e.target.value)}
						/>
					</Form.Group>

					<Form.Group className="mt-3">
						<Form.Label>Letra</Form.Label>
						<Form.Control
							as="textarea"
							rows={4}
							value={form.lyrics}
							onChange={(e) => handleChange("lyrics", e.target.value)}
							placeholder="Ej: You've got a hold of me..."
						/>
					</Form.Group>

				</Modal.Body>

				<Modal.Footer>

					<Button variant="secondary" onClick={onClose}>
						Cancelar
					</Button>

					<Button
						style={{ backgroundColor: "#6b4f3a", border: "none" }}
						onClick={handleCreate}
					>
						Agregar canción
					</Button>

				</Modal.Footer>

			</Modal>

			<SuccessModal
				show={modal.show}
				title={modal.title}
				message={modal.message}
				type={modal.type}
				onClose={() => {
					setModal({ ...modal, show: false });

					if (modal.type === "success") {
						onClose();
					}
				}}
			/>
		</>
	);
}