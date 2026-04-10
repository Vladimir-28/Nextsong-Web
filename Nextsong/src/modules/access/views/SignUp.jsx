import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleRegister } from "../controller/UserController";

export default function Register() {

    const navigate = useNavigate();

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
            alert("Usuario registrado correctamente");
            navigate("/login");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <main className="d-flex flex-column align-items-center">

            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div
                    className="card border-1 mb-4 p-4"
                    style={{ width: 450, overflow: "visible" }} // 👈 importante
                >

                    <Link
                        to="/login"
                        className="text-decoration-none d-inline-block mb-3 text-secondary"
                    >
                        ← Volver a inicio de sesión
                    </Link>

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
                        <div className="col-12 position-relative">
                            <label className="form-label">Contraseña *</label>

                            <div className="position-relative">

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    onFocus={() => setShowInfo(true)}
                                    onBlur={() => setShowInfo(false)}
                                    required
                                />

                                {/* ICONO */}
                                <span
                                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                                    style={{ cursor: "pointer" }}
                                    onMouseEnter={() => setShowInfo(true)}
                                    onMouseLeave={() => setShowInfo(false)}
                                >
                                    <i className="bi bi-info-circle"></i>
                                </span>

                                {/* TARJETA FLOTANTE */}
                                {showInfo && (
                                    <div
                                        className="position-absolute bg-white border rounded shadow p-2"
                                        style={{
                                            top: "110%",
                                            right: "0",
                                            width: "250px",
                                            zIndex: 10
                                        }}
                                    >
                                        <small className={validations.length ? "text-success" : "text-danger"}>
                                            • Mínimo 8 caracteres
                                        </small><br />

                                        <small className={validations.upper ? "text-success" : "text-danger"}>
                                            • Una mayúscula
                                        </small><br />

                                        <small className={validations.lower ? "text-success" : "text-danger"}>
                                            • Una minúscula
                                        </small><br />

                                        <small className={validations.number ? "text-success" : "text-danger"}>
                                            • Un número
                                        </small><br />

                                        <small className={validations.special ? "text-success" : "text-danger"}>
                                            • Un carácter especial
                                        </small>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="col-12">
                            <label className="form-label">Confirmar contraseña *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
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

        </main>
    );
}