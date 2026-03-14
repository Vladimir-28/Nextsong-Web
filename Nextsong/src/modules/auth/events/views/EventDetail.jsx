import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventsController from "../controller/events.controller";
import SongEventCard from "../components/SongEventCard";

export default function EventDetail() {

    const { id } = useParams();
    const [event, setEvent] = useState(null);

    const getEvent = async () => {
        const data = await EventsController.findById(id);
        setEvent(data);
    };

    useEffect(() => {
        getEvent();
    }, []);

    if (!event) {
        return <div className="container mt-4">Cargando evento...</div>
    }

    return (
        <div className="container mt-4">

            <h4>{event.title}</h4>
            <p className="text-muted">{event.date}</p>

            <h5 className="mt-4">Canciones</h5>

            {event.songs.length === 0 ? (
                <div className="alert alert-secondary rounded-4">
                    <span>Este evento no tiene canciones...</span>
                </div>
            ) : (
                event.songs.map(song => (
                    <SongEventCard songEvent={song} />
                ))
            )}

        </div>
    );
}