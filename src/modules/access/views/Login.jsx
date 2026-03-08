import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Login({ setSession }) {

    const navigate = useNavigate();

    const changeSession = () => {
        sessionStorage.setItem("token", "test.token.nextsong");
        setSession(true);
        navigate("/");
    };

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/");
        }
    }, []);

    return (
        <main className="d-flex flex-column align-items-center">

            {/* HEADER */}
            <Header />
            {/* LOGIN */}
            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Iniciar sesión</h2>
                            <p className="text-muted">
                                Accede a tus partituras digitales
                            </p>
                        </div>

                        <form className="row g-3">

                            {/* EMAIL */}
                            <div className="col-12">
                                <label className="form-label">
                                    Correo electrónico
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

                            {/* PASSWORD */}
                            <div className="col-12">
                                <label className="form-label">
                                    Contraseña
                                </label>

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

                            <div className="col-12 text-end">
                                <Link to="/recovery" style={{ color: "#b97a56" }}>
                                    ¿Olvidó su contraseña?
                                </Link>
                            </div>

                            {/* BOTON */}
                            <div className="col-12">
                                <button
                                    onClick={() => changeSession()}
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                >

                                    Iniciar sesión
                                </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <span className="text-muted">
                                    ¿No tiene cuenta?
                                </span>

                                <Link
                                    className="ms-2"
                                    to="/signUp"
                                    style={{ color: "#b97a56" }}
                                >
                                    Cree una
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

