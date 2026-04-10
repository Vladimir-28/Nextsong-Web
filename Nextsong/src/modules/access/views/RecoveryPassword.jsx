import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Recovery() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

     

        try {
            const response = await fetch(
                `http://localhost:8080/auth/recover-password?email=${email}`,
                {
                    method: "POST"
                }
            );

         if (response.ok) {
            setMessage("Código enviado ");
            setTimeout(() => {
                navigate("/verify-code", { state: { email } });
            }, 1500);
        } else {
                const error = await response.text();
                setMessage(error);
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

                        <Link
                            to="/login"
                            className="text-decoration-none d-inline-block mb-3 text-secondary"
                        >
                            ← Volver
                        </Link>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Recuperar contraseña</h2>
                            <p className="text-muted mb-0">
                                Ingrese su correo y le enviaremos un código de 6 dígitos.
                            </p>
                        </div>

                        <form className="row g-3" onSubmit={handleSubmit}>

                            <div className="col-12">
                                <label className="form-label">
                                    Correo electrónico *
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12 mt-3">
                                <button
                                    type="submit"
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                >
                                    Enviar código
                                </button>
                            </div>

                            {message && (
                                <div className="col-12 text-center mt-3">
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