import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { getUser, updateUser } from "../controller/UserController";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../../../components/SuccessModal";

export default function User() {
	const navigate = useNavigate();

	const [user, setUser] = useState({
		id: null,
		fullName: "",
		email: "",
		role: ""
	});

	const [form, setForm] = useState({
		fullName: "",
		password: "",
		confirmPassword: ""
	});

	const [loading, setLoading] = useState(true);

	// Modal state
	const [showModal, setShowModal] = useState(false);
	const [modalData, setModalData] = useState({
		title: "",
		message: "",
		type: "success"
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getUser();

				setUser(data);

				setForm({
					fullName: data.fullName,
					password: "",
					confirmPassword: ""
				});

			} catch (error) {
				console.error(error);

				setModalData({
					title: "Sesión expirada",
					message: "Por favor inicia sesión nuevamente",
					type: "error"
				});
				setShowModal(true);

				setTimeout(() => navigate("/login"), 1500);

			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const handleUpdate = async (e) => {
		e.preventDefault();

		// Validación nombre
		if (!form.fullName.trim()) {
			setModalData({
				title: "Campo requerido",
				message: "El nombre es obligatorio",
				type: "error"
			});
			setShowModal(true);
			return;
		}

		// Validación contraseña
		if (form.password) {
			const isValidPassword =
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(form.password);

			if (!isValidPassword) {
				setModalData({
					title: "Contraseña inválida",
					message: "Debe tener mayúscula, minúscula, número y carácter especial",
					type: "error"
				});
				setShowModal(true);
				return;
			}

			if (form.password !== form.confirmPassword) {
				setModalData({
					title: "Error",
					message: "Las contraseñas no coinciden",
					type: "error"
				});
				setShowModal(true);
				return;
			}
		}

		try {
			const updatedUser = await updateUser({
				id: user.id,
				fullName: form.fullName,
				password: form.password
			});

			setUser(updatedUser);

			setForm({
				fullName: updatedUser.fullName,
				password: "",
				confirmPassword: ""
			});

			const current = JSON.parse(sessionStorage.getItem("user")) || {};

			sessionStorage.setItem("user", JSON.stringify({
				...current,
				fullName: updatedUser.fullName
			}));

			// Éxito
			setModalData({
				title: "Actualizado",
				message: "Tus datos se actualizaron correctamente",
				type: "success"
			});
			setShowModal(true);

		} catch (error) {
			console.error(error);

			// Error
			setModalData({
				title: "Error",
				message: "No se pudieron actualizar los datos",
				type: "error"
			});
			setShowModal(true);
		}
	};

	if (loading) return <p className="text-center">Cargando...</p>;

	return (
		<div className="container py-4">

			<div className="mb-4">
				<h3 className="fw-bold">Mi Perfil</h3>
				<p className="text-muted">
					Consulta y actualiza tu información de cuenta
				</p>
			</div>

			<div className="card border mb-4 p-3">
				<div className="d-flex align-items-center">

					<div
						className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3"
						style={{
							width: "70px",
							height: "70px",
							fontSize: "22px",
							fontWeight: "bold",
							color: "#6c757d"
						}}
					>
						{user.fullName
							? user.fullName.substring(0, 2).toUpperCase()
							: "NA"}
					</div>

					<div>
						<div className="d-flex align-items-center gap-2">
							<h5 className="mb-0 fw-semibold">
								{user.fullName}
							</h5>

							<span className="badge bg-secondary-subtle text-dark border">
								{user.role?.name || "Sin rol"}
							</span>

							<span className="badge bg-success-subtle text-success border">
								Activo
							</span>
						</div>

						<div className="text-muted mt-1">
							{user.email}
						</div>

						<small className="text-muted">
							Gestiona tu información personal y de acceso
						</small>
					</div>
				</div>
			</div>

			<div className="card border p-4">

				<div className="d-flex justify-content-between align-items-center mb-3">
					<h5 className="fw-semibold mb-0">Información Personal</h5>
					<small className="text-muted">
						Los campos con * son obligatorios
					</small>
				</div>

				<hr />

				<form onSubmit={handleUpdate}>

					<div className="mb-3">
						<label className="form-label">
							Nombre completo *
						</label>
						<input
							type="text"
							className="form-control"
							value={form.fullName}
							onChange={(e) =>
								setForm(prev => ({
									...prev,
									fullName: e.target.value
								}))
							}
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">
							Correo electrónico *
						</label>
						<input
							type="email"
							className="form-control"
							value={user.email}
							disabled
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">
							Nueva contraseña
						</label>
						<input
							type="password"
							className="form-control"
							value={form.password}
							onChange={(e) =>
								setForm(prev => ({
									...prev,
									password: e.target.value
								}))
							}
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">
							Confirmar contraseña
						</label>
						<input
							type="password"
							className="form-control"
							value={form.confirmPassword}
							onChange={(e) =>
								setForm(prev => ({
									...prev,
									confirmPassword: e.target.value
								}))
							}
						/>
					</div>

					<div className="mb-3 d-flex justify-content-end">
						<button
							type="submit"
							className="btn text-white d-flex align-items-center"
							style={{ backgroundColor: "#a56d49" }}
						>
							<FaEdit className="me-1" /> Guardar cambios
						</button>
					</div>

				</form>

			</div>

			{/* MODAL */}
			<SuccessModal
				show={showModal}
				onClose={() => setShowModal(false)}
				title={modalData.title}
				message={modalData.message}
				type={modalData.type}
			/>

		</div>
	);
}