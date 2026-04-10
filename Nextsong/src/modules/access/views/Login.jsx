import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { handleLogin } from "../controller/LoginController";
import SuccessModal from "../../../components/SuccessModal";

export default function Login({ setSession }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // 🔥 Modal state
    const [modal, setModal] = useState({
        show: false,
        title: "",
        message: "",
        type: ""
    });

   

   const changeSession = async (e) => {
    e.preventDefault();

    try {
        const data = await handleLogin(email, password);
        console.log("DATA:", data);

        // 🔥 VALIDACIÓN REAL
        // Si no viene algo típico de usuario → error
        if (!data || data.error || data.message === "Credenciales incorrectas") {
            setModal({
                show: true,
                title: "Error",
                message: "Correo o contraseña incorrectos",
                type: "error"
            });
            return;
        }
        // ✔ éxito
        sessionStorage.setItem("user", JSON.stringify(data));

        setModal({
            show: true,
            title: "Bienvenido",
            message: "Inicio de sesión exitoso",
            type: "success"
        });

    } catch (error) {
    console.error("ERROR COMPLETO:", error);

    const msg = error?.message || "";

    // 🔥 detectar credenciales incorrectas
    if (
        msg.includes("401") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("credenciales") ||
        msg.toLowerCase().includes("bad credentials")
    ) {
        setModal({
            show: true,
            title: "Error",
            message: "Correo o contraseña incorrectos",
            type: "error"
        });
    } else {
        setModal({
            show: true,
            title: "Error",
            message: "Error del servidor",
            type: "error"
        });
    }
}
};

    useEffect(() => {
        if (sessionStorage.getItem("user")) {
            navigate("/");
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

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form className="row g-3" onSubmit={changeSession}>

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

            {/* 🔥 MODAL */}
            <SuccessModal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                
                onClose={() => {
                    setModal({ ...modal, show: false });

                    // ✔ SOLO si fue éxito
                    if (modal.type === "success") {
                        setSession(true);
                        navigate("/");
                    }
                }}
            />

        </main>
    );
}