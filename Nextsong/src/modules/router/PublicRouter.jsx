import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../access/views/Login";
import RecoveryPassword from "../access/views/RecoveryPassword";
import SignUp from "../access/views/SignUp";

import Error404 from "../errors/Error404";
import VerifyCode from "../access/views/VerifyCode";
import ResetPassword from "../access/views/ResetPassword";


export default function PublicRouter({ setSession }) {
	return (
		<Routes>

			{/* base */}
			<Route path="/" element={<Navigate to="/login" />} />

			{/* rutas públicas */}
			<Route path="/login" element={<Login setSession={setSession} />} />
			<Route path="/recovery" element={<RecoveryPassword />} />
			<Route path="/signUp" element={<SignUp />} />
			<Route path="/login" element={<Login setSession={setSession} />} />
			<Route path="/recovery" element={<RecoveryPassword />} />
			<Route path="/signUp" element={<SignUp />} />
			<Route path="/verify-code" element={<VerifyCode />} />
			<Route path="/reset-password" element={<ResetPassword />} />

			{/* 404 */}
			<Route path="*" element={<Error404 />} />

		</Routes>
	);
}