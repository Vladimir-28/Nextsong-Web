import { FaEdit} from "react-icons/fa";
export default function User() {
  return (
    <div className="container py-4">

     
      <div className="mb-4">
        <h3 className="fw-bold">Mi Perfil</h3>
        <p className="text-muted">
          Consulta y actualiza tu información de cuenta
        </p>
      </div>

      
      <div className="card shadow-sm border-0 mb-4 p-3">
        <div className="d-flex align-items-center">

         
          <div
            className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3"
            style={{ width: "70px", height: "70px", fontSize: "22px", fontWeight: "bold", color: "#6c757d" }}
          >
            JR
          </div>

          
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-semibold">Julio Ramírez Vladimir</h5>

              <span className="badge bg-secondary-subtle text-dark border">
                Administrador
              </span>

              <span className="badge bg-success-subtle text-success border">
                Activo
              </span>
            </div>

            <div className="text-muted mt-1">julio@email.com</div>
            <small className="text-muted">
              Gestiona tu información personal y de acceso
            </small>
          </div>
        </div>
      </div>

      
      <div className="card shadow-sm border-0 p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Información Personal</h5>
          <small className="text-muted">
            Los campos con * son obligatorios
          </small>
        </div>

        <hr />

        <form>

          
          <div className="mb-3">
            <label className="form-label">
              Nombre completo *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          
          <div className="mb-3">
            <label className="form-label">
              Correo electrónico *
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com (el correo no se puede modificar)"
              disabled
            />
          </div>

          
          <div className="mb-3">
            <label className="form-label">
              Nombre de usuario *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="nombreusuario"
            />
          </div>
          
          <div className="mb-3   d-flex justify-content-end">
           < button
                className="btn text-white d-flex justify-content-center align-items-center"
                style={{ backgroundColor: "#a56d49" }}
            >
            <FaEdit className="me-1"/> Editar Información
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}