import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Login";
import DomainFinder from "@/pages/domain-finder";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />} >
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/domain-search" element={<DomainFinder />} />
            </Route>
            <Route path="/" element={<Login />} />
        </Routes>

    )
}

export default AppRoutes;