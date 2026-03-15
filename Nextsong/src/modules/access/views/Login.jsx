import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

export default function Login({ setSession }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


   const changeSession = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/auth/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:email,
            password:password
        })
    });

    if(response.ok){

        const data = await response.json();

        alert("Inicio de sesión correcto");

        sessionStorage.setItem("user", JSON.stringify(data));

        setSession(true);
        

    }else{

        alert("Correo o contraseña incorrectos");

    }
};
    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/");
        }
    }, []);

    return (
        <main className="d-flex flex-column align-items-center">

            
            {/* LOGIN */}
            <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "80vh" }}
            >
                <div className="card border-0 shadow" style={{ width: 450 }}>
                    <div className="card-body p-4">

                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Iniciar sesión</h2>
                            <p className="text-muted">
                                Accede a tus partituras digitales
                            </p>
                            
                        </div>
                        
                        <form className="row g-3" onSubmit={changeSession}>

                            {/* EMAIL */}
                            <div className="col-12">
                                <label className="form-label">
                                    Correo electrónico *
                                </label>

                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope"></i>
                                    </span>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="col-12">
                                <label className="form-label">
                                    Contraseña *
                                </label>

                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-12 text-end">
                                <Link to="/recovery" style={{ color: "#b97a56" }}>
                                    ¿Olvidó su contraseña?
                                </Link>
                            </div>

                            {/* BOTON */}
                            <div className="col-12">
                                <button
                                onClick={changeSession}
                                    type="submit"
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: "#a56d49" }}
                                >

                                    Iniciar sesión
                                </button>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <span className="text-muted">
                                    ¿No tiene cuenta?
                                </span>

                                <Link
                                    className="ms-2"
                                    to="/signUp"
                                    style={{ color: "#b97a56" }}
                                >
                                    Cree una
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

