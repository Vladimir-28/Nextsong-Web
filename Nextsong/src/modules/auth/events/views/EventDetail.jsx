import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventsController from "../controller/events.controller";
import SongEventCard from "../components/SongEventCard";
import EventSongsController from "../controller/eventsongs.controller";

export default function EventDetail() {

    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [songs, setSongs] = useState([]);

    const getEvent = async () => {
        const data = await EventsController.findById(id);
        setEvent(data);
    };

    const getSongs = async () => {
        const data = await EventSongsController.getSongsByEvent(id);
        setSongs(data);
    };

    useEffect(() => {
        getEvent();
        getSongs();
    }, []);

    if (!event) {
        return <div className="container mt-4">Cargando evento...</div>
    }

    return (
        <div className="container mt-4">

            <h4>{event.name}</h4>
            <p className="text-muted">{event.eventDate}</p>

            <h5 className="mt-4">Canciones</h5>

            {songs.length === 0 ? (
                <div className="alert alert-secondary rounded-4">
                    <span>Este evento no tiene canciones...</span>
                </div>
            ) : (
                songs.map(song => (
                    <SongEventCard key={song.id} songEvent={song} />
                ))
            )}

        </div>
    );
}