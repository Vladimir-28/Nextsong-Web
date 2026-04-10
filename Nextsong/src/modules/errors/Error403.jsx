import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

export default function Error403() {
  const navigate = useNavigate();

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      
      <div className="text-center">

        {/* Icono */}
        <div className="mb-3">
          <FaLock size={45} color="#a56d49" />
        </div>

        {/* Código */}
        <h1
          className="fw-bold mb-2"
          style={{ fontSize: "3.5rem", color: "#a56d49" }}
        >
          403
        </h1>

        {/* Título */}
        <h4 className="fw-semibold mb-2">
          Acceso denegado
        </h4>

        {/* Mensaje */}
        <p className="text-muted mb-4">
          No tienes permisos para acceder a este recurso.
        </p>

        {/* Botón */}
        <button
          className="btn text-white"
          style={{ backgroundColor: "#a56d49" }}
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>

      </div>

    </div>
  );
}