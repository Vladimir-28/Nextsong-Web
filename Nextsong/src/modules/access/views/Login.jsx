import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { handleLogin } from "../controller/LoginController";

export default function Login({ setSession }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const changeSession = async (e) => {
        e.preventDefault();

        try {
            const data = await handleLogin(email, password);

            alert("Inicio de sesión correcto");

            sessionStorage.setItem("user", JSON.stringify(data));

            setSession(true);

            navigate("/"); 

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("user")) { 
            navigate("/");
        }
    }, []);

    return (
        <main className="d-flex flex-column align-items-center">

            <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "80vh" }}>
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Iniciar sesión</h2>
                            <p className="text-muted">
                                Accede a tus partituras digitales
                            </p>
                        </div>

                        <form className="row g-3" onSubmit={changeSession}>

                            {/* EMAIL */}
                            <div className="col-12">
                                <label className="form-label">Correo electrónico *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="tu@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* PASSWORD */}
                            <div className="col-12">
                                <label className="form-label">Contraseña *</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="col-12 text-end">
                                <Link to="/recovery" style={{ color: "#b97a56" }}>
                                    ¿Olvidó su contraseña?
                                </Link>
                            </div>

                            <div className="col-12">
                                <button
                                    type="submit"
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                >
                                    Iniciar sesión
                                </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <span className="text-muted">¿No tiene cuenta?</span>
                                <Link className="ms-2" to="/signUp" style={{ color: "#b97a56" }}>
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