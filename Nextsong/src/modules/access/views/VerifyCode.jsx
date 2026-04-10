import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function VerifyCode() {

    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:8080/auth/verify-code?email=${email}&code=${code}`,
                { method: "POST" }
            );

            if (response.ok) {
                setMessage("Código correcto");

                setTimeout(() => {
                    navigate("/reset-password", { state: { email } });
                }, 1000);

            } else {
                setMessage("Código incorrecto o expirado");
            }

        } catch (error) {
            setMessage("Error al conectar con el servidor");
        }
    };

    return (
        <main className="d-flex flex-column align-items-center">

            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <Link to="/recovery" className="mb-3 d-inline-block">
                            ← Volver
                        </Link>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Verificar código</h2>
                            <p className="text-muted">
                                Ingresa el código de 6 dígitos enviado a tu correo.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                className="form-control mb-3 text-center"
                                placeholder="Código"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                required
                            />

                            <button className="btn w-100 text-white"
                                style={{ backgroundColor: "#a56d49" }}>
                                Verificar
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