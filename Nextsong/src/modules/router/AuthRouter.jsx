import { Navigate, Route, Routes } from "react-router-dom";
import Songs from "../auth/songs/views/Songs";
import Events from "../auth/events/views/Events";
import Home from "../auth/home/Home";
import EventDetail from "../auth/events/views/EventDetail";
import User from "../auth/user/view/User";
import SongDetail from "../auth/songs/views/SongDetail";
import Error404 from "../errors/Error404";


export default function AuthRouter(){
    return(
    <Routes>

        <Route path="/" element={<Navigate to="/home" /> } />
        <Route path="/home" element={<Home/>} />
        <Route path="/songs" element={<Songs/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/users" element={<User/>} />
<<<<<<< HEAD
        <Route path="*" element={<Error404/>} />
=======
        <Route path="/*" element={ <Navigate to="/" /> } />

        
>>>>>>> develop

        {/* Rutas dinámicas */}
        <Route path="/events/:id" element={<EventDetail/>} />
        <Route path="/songs/:id" element={<SongDetail/>} />

    </Routes>
    );
}