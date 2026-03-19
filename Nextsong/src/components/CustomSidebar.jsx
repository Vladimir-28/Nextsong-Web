import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { RxExit } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";
import CreateIndependentSong from '../modules/auth/songs/views/CreateIndependentSong';
import { useState } from 'react';
import CreateEventModal from '../modules/auth/events/components/CreateEventModal';


export default function CustomSidebar({setSession}) {
	const [showModalSong, setShowModalSong] = useState(false);
	const [showModalEvent, setShowModalEvent] = useState(false);
	const navigate = useNavigate();
    const closeSession = () => {
        sessionStorage.removeItem("user");
        setSession(false);
        navigate("/");
    }
	
	return (
		<div
			className="offcanvas offcanvas-start sidebar p-3 shadow"
			id="sidebarMenu"
		>

			<div className="offcanvas-header">
				<div className="d-flex align-items-center gap-2 sidebar-logo">
					<i
						className="bi bi-apple-music me-1"
						style={{ color: "#C58A5C", fontSize: "40px" }}
					></i>
					NextSong
				</div>

				<button
					className="btn-close"
					data-bs-dismiss="offcanvas"
				></button>
			</div>

			<div className="offcanvas-body">

				<ul className="nav flex-column">

					<li className="nav-item">
						<NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
							<i className="bi bi-house me-2"></i>
							Inicio
						</NavLink>
					</li>

					<li className="nav-item">
						<NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
							<i className="bi bi-calendar-event me-2"></i>
							Eventos
						</NavLink>
					</li>

					<li className="nav-item">
						<NavLink to="/songs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
							<i className="bi bi-music-note me-2"></i>
							Canciones Independientes
						</NavLink>
					</li>

					<li className="nav-item">
						<NavLink to="users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
							<i className="bi bi-person me-2"></i>
							Mi Perfil
						</NavLink>
					</li>

				</ul>
				<div className="mt-5">
					<button
						className="btn text-white d-flex justify-content-start align-items-center  w-100 mb-2"
						style={{ backgroundColor: "#a56d49" }}
						onClick={() => setShowModalEvent(true)}
					>
						<FaPlus className="me-1" /> Crear Evento
					</button>
					<button
						className="btn text-white d-flex justify-content-start align-items-center w-100"
						style={{ backgroundColor: "#a56d49" }}
						onClick={() => setShowModalSong(true)}
					>
						<FaPlus className="me-1" /> Agregar Canción Independiente
					</button>
				</div>

			</div>

			<div className='border-top p-2'>
				
				<button className="btn btn-outline-danger border-0 d-flex justify-content-start align-items-center w-50"
					onClick={() => closeSession()}
				>
					<RxExit className='me-1' /> Cerrar sesión
				</button>	
				
			</div>

			{/* MODAL DE CREAR CANCION  INDEPENDIENTE*/}

			<CreateIndependentSong show={showModalSong}
				onClose={() => setShowModalSong(false)} />
			
			{/* MODAL DE CREAR EVENTO*/}

			<CreateEventModal show={showModalEvent}
				onClose={() => setShowModalEvent(false)} />
		</div>
	);
}