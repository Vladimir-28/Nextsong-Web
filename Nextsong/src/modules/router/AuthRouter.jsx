import { Navigate, Route, Routes } from "react-router-dom";

import Songs from "../auth/songs/views/Songs";
import Events from "../auth/events/views/Events";
import Home from "../auth/home/Home";
import EventDetail from "../auth/events/views/EventDetail";
import User from "../auth/user/view/User";
import SongDetail from "../auth/songs/views/SongDetail";

import Error404 from "../errors/Error404";
import Error403 from "../errors/Error403";

export default function AuthRouter() {
    return (
        <Routes>

            {/* base */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* rutas */}
            <Route path="/home" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/users" element={<User />} />

            {/* dinámicas */}
            <Route path="/songs/:id" element={<SongDetail />} />
            <Route path="/events/:id" element={<EventDetail />} />

            {/* 404 */}
            <Route path="*" element={<Error404 />} />

            {/* 403 */}
            <Route path="/forbidden" element={<Error403 />} />

        </Routes>
    );
}