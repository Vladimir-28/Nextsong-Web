import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Recovery() {

    return (
        <main className="d-flex flex-column align-items-center">

           
            {/* RECOVERY */}
            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        {/* Volver */}
                        <Link
                            to="/login"
                            className="text-decoration-none d-inline-block mb-3 text-secondary"
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Volver a inicio de sesión
                        </Link>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Recuperar contraseña</h2>
                            <p className="text-muted mb-0">
                                Ingrese su correo electrónico y le enviaremos un enlace
                                para restablecer su contraseña
                            </p>
                        </div>
                        <p className="text-muted small mb-4">
                          Los campos con <span className="text-danger">*</span> son obligatorios
                       </p>

                        <form className="row g-3">

                            {/* EMAIL */}
                            <div className="col-12">
                                <label className="form-label">
                                    Correo electrónico *
                                </label>

                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            {/* BOTON */}
                            <div className="col-12 mt-3">
                                <button
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                >
                                    Enviar enlace de recuperación
                                </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <span className="text-muted">
                                    ¿Recordó su contraseña?
                                </span>

                                <Link
                                    className="ms-2"
                                    to="/login"
                                    style={{ color: "#b97a56" }}
                                >
                                    Inicie sesión
                                </Link>
                            </div>

                        </form>

                    </div>
                </div>
            </div>

        </main>
    );
}