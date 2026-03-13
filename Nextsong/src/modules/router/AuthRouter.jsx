import { Route, Routes } from "react-router-dom";
import Songs from "../auth/songs/views/Songs";
import Events from "../auth/events/views/Events";
import Home from "../auth/home/Home";
import EventDetail from "../auth/events/views/EventDetail";

export default function AuthRouter(){
    return(
    <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/songs" element={<Songs/>} />
        <Route path="/events" element={<Events/>} />

        {/* NUEVA RUTA */}
        <Route path="/events/:id" element={<EventDetail/>} />

    </Routes>
    );
}