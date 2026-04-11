import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleRegister } from "../controller/UserController";
import SuccessModal from "../../../components/SuccessModal";

export default function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [modal, setModal] = useState({
        show: false,
        title: "",
        message: "",
        type: ""
    });

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [showInfo, setShowInfo] = useState(false);

    // 🔐 VALIDACIONES
    const validations = {
        length: form.password.length >= 8,
        upper: /[A-Z]/.test(form.password),
        lower: /[a-z]/.test(form.password),
        number: /\d/.test(form.password),
        special: /[@$!%*?&.#_-]/.test(form.password)
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const isValidPassword = Object.values(validations).every(v => v);

        if (!isValidPassword) {
            setError("La contraseña no cumple los requisitos.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            await handleRegister(form);

            setModal({
                show: true,
                title: "Registro exitoso",
                message: "Tu cuenta fue creada correctamente",
                type: "success"
            });

        } catch (error) {
            console.error(error);

            setModal({
                show: true,
                title: "Error",
                message: error.message || "No se pudo registrar",
                type: "error"
            });
        }
    };

    return (
        <main className="d-flex flex-column align-items-center">

            <div className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}>

                <div className="card border-1 mb-4 p-4"
                    style={{ width: 450, overflow: "visible" }}>

                    {/* BACK */}
                    <Link
                        to="/login"
                        className="text-decoration-none d-inline-block mb-3 text-secondary"
                    >
                        ← Volver a inicio de sesión
                    </Link>

                    {/* HEADER */}
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">Crear cuenta</h2>
                        <p className="text-muted mb-0">
                            Comience a gestionar sus partituras hoy
                        </p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form className="row g-3" onSubmit={onSubmit}>

                        {/* NOMBRE */}
                        <div className="col-12">
                            <label className="form-label">Nombre completo *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="col-12">
                            <label className="form-label">Correo electrónico *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="col-12">
                            <label className="form-label d-flex justify-content-between align-items-center">
                                Contraseña *

                                <i
                                    className="bi bi-info-circle text-muted"
                                    style={{ cursor: "pointer" }}
                                    onMouseEnter={() => setShowInfo(true)}
                                    onMouseLeave={() => setShowInfo(false)}
                                ></i>
                            </label>

                            <div className="input-group">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    onFocus={() => setShowInfo(true)}
                                    onBlur={() => setShowInfo(false)}
                                    required
                                />

                                <span
                                    className="input-group-text bg-white"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                            </div>

                            {/* INFO PASSWORD */}
                            {showInfo && (
                                <div className="position-absolute bg-white border rounded shadow p-2 mt-1"
                                    style={{ width: "250px", zIndex: 10 }}>
                                    <small className={validations.length ? "text-success" : "text-danger"}>• Mínimo 8 caracteres</small><br />
                                    <small className={validations.upper ? "text-success" : "text-danger"}>• Una mayúscula</small><br />
                                    <small className={validations.lower ? "text-success" : "text-danger"}>• Una minúscula</small><br />
                                    <small className={validations.number ? "text-success" : "text-danger"}>• Un número</small><br />
                                    <small className={validations.special ? "text-success" : "text-danger"}>• Un carácter especial</small>
                                </div>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="col-12">
                            <label className="form-label">Confirmar contraseña *</label>

                            <div className="input-group">

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="form-control"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />

                                <span
                                    className="input-group-text bg-white"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                            </div>
                        </div>

                        {/* BOTÓN */}
                        <div className="col-12 mt-3">
                            <button
                                type="submit"
                                className="btn w-100 text-white"
                                style={{ backgroundColor: "#a56d49" }}
                            >
                                Crear cuenta
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* MODAL */}
            <SuccessModal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => {
                    setModal({ ...modal, show: false });

                    if (modal.type === "success") {
                        navigate("/login");
                    }
                }}
            />

        </main>
    );
}