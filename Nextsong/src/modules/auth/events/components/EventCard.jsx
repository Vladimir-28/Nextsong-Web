import { BsChevronRight, BsPeople, BsMusicNote, BsCalendarEvent, BsBriefcase } from "react-icons/bs";
import { LuChurch } from "react-icons/lu";

// 🔥 mapear categorías a iconos
const icons = {
	boda: <BsPeople size={20} />,
	misa: <LuChurch size={20} />,
	concierto: <BsMusicNote size={20} />,
	ensayo: <BsCalendarEvent size={20} />,
	corporativo: <BsBriefcase size={20} />
};

export default function EventCard({ event, onClick }) {

	return (
		<div className="col-md-4 mb-4">

			<div
				className="card shadow-sm h-100 p-3"
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

					<button className="btn p-0 border-0 bg-transparent">
						<BsChevronRight />
					</button>

				</div>

				<span className="badge bg-light text-dark mt-3 text-capitalize">
					{event.category}
				</span>

				<h6 className="mt-2">{event.name}</h6>

				<small className="text-muted">
					{event.eventDate
						? new Date(event.eventDate).toLocaleDateString()
						: "Sin fecha"}
				</small>

				<hr />

				<div className="d-flex justify-content-between">
					<small className="text-muted">Canciones</small>
					<strong>{event.songs?.length || 0}</strong>
				</div>

			</div>

		</div>
	);
}