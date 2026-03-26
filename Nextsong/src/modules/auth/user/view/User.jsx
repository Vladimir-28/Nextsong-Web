import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { getUser, updateUser } from "../controller/UserController";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
    fullName: "",
    email: "",
    role: ""
  });

  const [form, setForm] = useState({
    fullName: "",
    password: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();

        setUser(data);

        setForm({
          fullName: data.fullName,
          password: ""
        });

      } catch (error) {
        console.error(error);
        alert("Sesión expirada");
        navigate("/login");
        
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      return alert("El nombre es obligatorio");
    }

    try {
      const updatedUser = await updateUser({
        id: user.id,
        fullName: form.fullName,
        password: form.password
      });

      setUser(updatedUser);

      setForm({
        fullName: updatedUser.fullName,
        password: ""
      });

      // 🔥 FIX AQUÍ TAMBIÉN
      const current = JSON.parse(sessionStorage.getItem("user")) || {};

      sessionStorage.setItem("user", JSON.stringify({
        ...current,
        fullName: updatedUser.fullName
      }));

      alert("Datos actualizados correctamente");

    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  if (loading) return <p className="text-center">Cargando...</p>;

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
            style={{
              width: "70px",
              height: "70px",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#6c757d"
            }}
          >
            {user.fullName
              ? user.fullName.substring(0, 2).toUpperCase()
              : "NA"}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-semibold">
                {user.fullName}
              </h5>

              <span className="badge bg-secondary-subtle text-dark border">
                {user.role?.name || "Sin rol"}
              </span>

              <span className="badge bg-success-subtle text-success border">
                Activo
              </span>
            </div>

            <div className="text-muted mt-1">
              {user.email}
            </div>

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

        <form onSubmit={handleUpdate}>

          <div className="mb-3">
            <label className="form-label">
              Nombre completo *
            </label>
            <input
              type="text"
              className="form-control"
              value={form.fullName}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  fullName: e.target.value
                }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Correo electrónico *
            </label>
            <input
              type="email"
              className="form-control"
              value={user.email}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  password: e.target.value
                }))
              }
            />
          </div>

          <div className="mb-3 d-flex justify-content-end">
            <button
              type="submit"
              className="btn text-white d-flex align-items-center"
              style={{ backgroundColor: "#a56d49" }}
            >
              <FaEdit className="me-1" /> Guardar cambios
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}