import '../styles/style.css';
import { RxExit } from "react-icons/rx";

export default function CustomSidebar() {
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
						<a className="nav-link active">
							<i className="bi bi-house me-2"></i>
							Inicio
						</a>
					</li>

					<li className="nav-item">
						<a className="nav-link">
							<i className="bi bi-calendar-event me-2"></i>
							Eventos
						</a>
					</li>

					<li className="nav-item">
						<a className="nav-link">
							<i className="bi bi-music-note me-2"></i>
							Canciones Independientes
						</a>
					</li>

					<li className="nav-item">
						<a className="nav-link">
							<i className="bi bi-person me-2"></i>
							Mi Perfil
						</a>
					</li>

				</ul>

			</div>
			<div className='border-top p-2'>
				<button className="btn btn-outline-danger border-0 d-flex justify-content-start align-items-center w-50">
					<RxExit className='me-1' /> Cerrar sesión
				</button>
			</div>
		</div>
	);
}