import { BsChevronRight, BsPeople, BsMusicNote, BsCalendarEvent, BsBriefcase } from "react-icons/bs";
import { LuChurch } from "react-icons/lu";

const icons = {
  people: <BsPeople size={20} />,
  music: <BsMusicNote size={20} />,
  calendar: <BsCalendarEvent size={20} />,
  briefcase: <BsBriefcase size={20} />,
  church: <LuChurch  size={20} />
};

export default function EventCard({ event }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100 p-3">

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
            {icons[event.icon]}
          </div>

          <button className="btn p-0 border-0 bg-transparent">
            <BsChevronRight />
          </button>

        </div>

        <span className="badge bg-light text-dark mt-3">
          {event.type}
        </span>

        <h6 className="mt-2">{event.title}</h6>

        <small className="text-muted">
          {event.date}
        </small>

        <hr />

        <div className="d-flex justify-content-between">
          <small className="text-muted">Canciones</small>
          <strong>{event.songs}</strong>
        </div>

      </div>
    </div>
  );
}