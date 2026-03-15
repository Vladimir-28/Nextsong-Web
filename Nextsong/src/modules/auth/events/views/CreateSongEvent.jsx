import { FaCheck } from "react-icons/fa6";

export default function CreateSongEvent({ show, onClose }) {

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <div>
                <h5 className="fw-bold mb-0">Crear Nuevo Evento</h5>
                <small className="text-muted">
                  Paso 2: Agregar canciones
                </small>
              </div>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">

              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: "#d7c8bd",
                  border: "1px solid #b89e8c"
                }}
              >

                <h6 className="fw-bold mb-3">
                  Crear nueva canción
                </h6>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Título *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre de la canción"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Artista *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre del artista"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Duración</label>
                    <input className="form-control" placeholder="3:30" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tempo (BPM)</label>
                    <input className="form-control" placeholder="120" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tonalidad</label>
                    <input className="form-control" />
                  </div>

                </div>

                <div className="mt-4 d-flex gap-2">

                  <button
                    className="btn text-white"
                    style={{ backgroundColor: "#5a4636" }}
                  >
                    <FaCheck className="me-1"/> Agregar canción
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-between">

           <button
                className="btn btn-light"
           >
              Volver
            </button>

            <button
               className="btn text-white"
                style={{ backgroundColor: "#cbb2a1" }}
            >
             <FaCheck className="me-1"/>Crear evento
            </button>

</div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}