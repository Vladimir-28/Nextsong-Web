import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { handleLogin } from "../controller/LoginController";

export default function Login({ setSession }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Añadido para mostrar errores

    const navigate = useNavigate();

    const changeSession = async (e) => {
        e.preventDefault();

        try {
            const data = await handleLogin(email, password);
            console.log("LOGIN DATA:", data);

            if (data) {
                alert("Inicio de sesión correcto");

                // Guardar los datos del usuario en sessionStorage
                sessionStorage.setItem("user", JSON.stringify(data));
                console.log("GUARDADO:", sessionStorage.getItem("user"));

                setSession(true);  // Aquí cambiamos el estado global de la sesión

                // Redirigir al usuario a la página principal
                navigate("/"); 
            }

        } catch (error) {
            console.error(error);
            setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("user")) { 
            navigate("/"); // Si ya hay un usuario en sessionStorage, redirigir a la página principal
        }
    }, [navigate]);

    return (
        <main className="d-flex flex-column align-items-center">

            <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "80vh" }}>
                <div className="card border-1 mb-4 p-4" style={{ width: 450 }}>

                    <div className="text-center mb-4">
                        <h2 className="fw-bold">Iniciar sesión</h2>
                        <p className="text-muted">
                            Accede a tus partituras digitales
                        </p>
                    </div>

                    {/* Mostrar mensaje de error si es necesario */}
                    {error && <div className="alert alert-danger">{error}</div>}

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
                                required
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
                                required
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
        </main>
    );
}