import { useNavigate } from 'react-router';
import '../styles/style.css';
import { RxExit } from "react-icons/rx";

export default function CustomNavbar({setSession}) {
	const navigate = useNavigate();
    const closeSession = () => {
        sessionStorage.removeItem("user");
        setSession(false);
        navigate("/");
    }
	return (
		<nav className="navbar top-navbar px-3 d-flex align-items-center">

			<button
				className="btn d-flex align-items-center"
				data-bs-toggle="offcanvas"
				data-bs-target="#sidebarMenu"
			>
				<i className="bi bi-list fs-4"></i>
			</button>

			<div className="d-flex justify-content-center align-items-center">
				<i
					className="bi bi-apple-music me-1"
					style={{ color: "#C58A5C", fontSize: "40px" }}
				></i>
				<span className="fw-semibold">NextSong</span>
			</div>

			<button onClick={() => closeSession()} className="btn btn-outline-danger btn-sm border-0 d-flex justify-content-center align-items-center">
				<RxExit className='me-1' /> Cerrar sesión
			</button>

		</nav>
	);
}