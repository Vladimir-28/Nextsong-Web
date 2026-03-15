import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Register() {
    return (
        <main className="d-flex flex-column align-items-center">

            
            {/* REGISTER */}
            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <Link
                            to="/login"
                            className="text-decoration-none d-inline-block mb-3 text-secondary"
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Volver a inicio de sesión
                        </Link>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Crear cuenta</h2>
                            <p className="text-muted mb-0">
                                Comience a gestionar sus partituras hoy
                            </p>
                        </div>
                        

                        <form className="row g-3">

                            <div className="col-12">
                                <label className="form-label">Nombre completo *</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Correo electrónico *</label>
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

                            <div className="col-12">
                                <label className="form-label">Contraseña *</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Confirmar contraseña *</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="col-12 mt-3">
                                <button
                                    type="submit"
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                >
                                    Crear cuenta
                                </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <span className="text-muted">¿Ya tiene cuenta?</span>
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