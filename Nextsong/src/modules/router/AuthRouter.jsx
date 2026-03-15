import { Route, Routes } from "react-router-dom";
import Songs from "../auth/songs/views/Songs";
import Events from "../auth/events/views/Events";
import Home from "../auth/home/Home";
import EventDetail from "../auth/events/views/EventDetail";
import User from "../auth/user/view/User";

export default function AuthRouter(){
    return(
    <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/songs" element={<Songs/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/users" element={<User/>} />

        {/* NUEVA RUTA */}
        <Route path="/events/:id" element={<EventDetail/>} />

    </Routes>
    );
}