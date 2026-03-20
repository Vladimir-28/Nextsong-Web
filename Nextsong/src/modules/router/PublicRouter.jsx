import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../access/views/Login";
import RecoveryPassword  from "../access/views/RecoveryPassword";
import SignUp from "../access/views/SignUp";
import Error404 from "../errors/Error404";


export default function PublicRouter({setSession}){
    return(
    <Routes>
        <Route path="/login" element={ <Login setSession={setSession}/>} />
        <Route path="/" element={ <Navigate to="/login" /> } />
        <Route path="/recovery" element={ <RecoveryPassword/>} />
        <Route path="/signUp" element={ <SignUp/>} />

        <Route path="*" element={<Error404/>} />
        
         
        
        
    </Routes>
    );
}