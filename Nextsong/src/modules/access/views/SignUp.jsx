import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { handleRegister } from "../controller/UserController";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleRegister(form);
            alert("Usuario registrado correctamente");

            // 🔥 redirección automática
            navigate("/login");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <main className="d-flex flex-column align-items-center">

            <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "80vh" }}>
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <Link to="/login" className="text-decoration-none d-inline-block mb-3 text-secondary">
                            ← Volver a inicio de sesión
                        </Link>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Crear cuenta</h2>
                            <p className="text-muted mb-0">
                                Comience a gestionar sus partituras hoy
                            </p>
                        </div>

                        <form className="row g-3" onSubmit={onSubmit}>

                            <div className="col-12">
                                <label className="form-label">Nombre completo *</label>
                                <input type="text" name="name" className="form-control" onChange={handleChange}/>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Correo electrónico *</label>
                                <input type="email" name="email" className="form-control" onChange={handleChange}/>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Contraseña *</label>
                                <input type="password" name="password" className="form-control" onChange={handleChange}/>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Confirmar contraseña *</label>
                                <input type="password" name="confirmPassword" className="form-control" onChange={handleChange}/>
                            </div>

                            <div className="col-12 mt-3">
                                <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#a56d49" }}>
                                    Crear cuenta
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </main>
    );
}