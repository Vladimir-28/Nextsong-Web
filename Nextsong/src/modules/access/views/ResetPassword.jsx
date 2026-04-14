import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { buildApiUrl } from "../../../services/api";

export default function ResetPassword() {

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(newPassword)) {
            setMessage("Debe tener mayúscula, minúscula, número y carácter especial");
            return;
        }

        try {
            const response = await fetch(
                buildApiUrl(`/auth/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`),
                { method: "POST" }
            );

            if (response.ok) {
                setMessage("Contraseña actualizada");

                setTimeout(() => {
                    navigate("/login");
                }, 1500);

            } else {
                setMessage("Error al actualizar contraseña");
            }

        } catch (error) {
            setMessage("Error al conectar con el servidor");
        }
    };
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
        return regex.test(password);
    };

    return (
        <main className="d-flex flex-column align-items-center">

            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <Link to="/login" className="mb-3 d-inline-block">
                            ← Volver al login
                        </Link>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Nueva contraseña</h2>
                            <p className="text-muted">
                                Ingresa tu nueva contraseña.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <small className="text-muted">
                                Debe contener:
                                <br />• 8 caracteres mínimo
                                <br />• 1 mayúscula
                                <br />• 1 minúscula
                                <br />• 1 número
                                <br />• 1 carácter especial
                                <br />
                            </small>

                            <button className="btn w-100 text-white"
                                style={{ backgroundColor: "#a56d49" }}>
                                Guardar contraseña
                            </button>

                            {message && (
                                <div className="text-center mt-3">
                                    <small>{message}</small>
                                </div>
                            )}

                        </form>

                    </div>
                </div>
            </div>

        </main>
    );
}
