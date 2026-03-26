import { BsChevronRight, BsPeople, BsMusicNote, BsCalendarEvent, BsBriefcase, BsTrash } from "react-icons/bs";
import { LuChurch } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";

// mapear categorías a iconos
const icons = {
	boda: <BsPeople size={20} />,
	misa: <LuChurch size={20} />,
	concierto: <BsMusicNote size={20} />,
	ensayo: <BsCalendarEvent size={20} />,
	corporativo: <BsBriefcase size={20} />
};

export default function EventCard({ event, onClick, onDelete, onEdit, user }) {

	// validación de admin 
	const isAdmin = user?.role === 'ADMIN';
	// 🔥 función arriba
const formatDate = (date) => {
  if (!date) return "";

  const clean = date.includes("T") ? date.split("T")[0] : date;
  const [year, month, day] = clean.split("-");

  return `${day}/${month}/${year}`;
};

	return (
		<div className="col-md-4 mb-4">

			<div
				className="card h-100 p-3"
				style={{ cursor: "pointer" }}
				onClick={onClick}
			>

				<div className="d-flex justify-content-between">

					<div
						className="d-flex align-items-center justify-content-center"
						style={{
							width: "45px",
							height: "45px",
							background: "#f3f4f6",
							borderRadius: "10px"
						}}
					>
						{icons[event.category] || <BsCalendarEvent size={20} />}
					</div>

					<div className="d-flex align-items-center gap-2">

						{/* Botón eliminar SOLO ADMIN */}
						{isAdmin && (
							<button
								className="btn p-0 border-0 bg-transparent text-danger"
								onClick={(e) => {
									e.stopPropagation(); 
									onDelete && onDelete(event.id);
								}}
							>
								<BsTrash />
							</button>
						)}
						{/* EDITAR SOLO ADMIN */}
                        {isAdmin && (
						<button
							className="btn p-0 border-0 bg-transparent text-warning"
							onClick={(e) => {
								e.stopPropagation();
								onEdit && onEdit(event);
							}}
						>
							<FaEdit />
						</button>
						)} 

						<button className="btn p-0 border-0 bg-transparent">
							<BsChevronRight />
						</button>
						

					</div>

				</div>

				<span className="badge bg-light text-dark mt-3 text-capitalize">
					{event.category}
				</span>

				<h6 className="mt-2">{event.name}</h6>

				<small className="text-muted">
					{event.eventDate
    ? formatDate(event.eventDate)
    : "Sin fecha"}
				</small>

				<hr />

				<div className="d-flex justify-content-between">
					<small className="text-muted">Canciones</small>
					<strong>{event.songsCount || 0}</strong>
				</div>
			</div>

		</div>
	);
}