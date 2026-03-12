import { Route, Routes } from "react-router-dom";
import Login from "../access/views/Login";
import RecoveryPassword  from "../access/views/RecoveryPassword";
import SignUp from "../access/views/SignUp";

export default function PublicRouter(){
    return(
    <Routes>
        <Route path="/login" element={ <Login/>} />
        <Route path="/" element={ <Login/>} />
        <Route path="/recovery" element={ <RecoveryPassword/>} />
        <Route path="/signUp" element={ <SignUp/>} />
         
        
        
    </Routes>
    );
}