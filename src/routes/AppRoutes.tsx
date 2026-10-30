import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Login";
import DomainFinder from "@/pages/domain-finder";
import Unsplash from "@/pages/Unsplash";
import InternetDetective from "@/pages/InternetDetective";
import Hormones from "@/pages/Hormones";
import Quotes from "@/pages/Quotes";
import WorldMap from "@/pages/WorldMap";
import ImageUpload from "@/pages/ImageUpload";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />} >
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/domain-search" element={<DomainFinder />} />
                <Route path="/unsplash" element={<Unsplash />} />
                <Route path="/detective" element={<InternetDetective />} />
                <Route path="/hormones" element={<Hormones />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/maps" element={<WorldMap />} />
                <Route path="/file-box" element={<ImageUpload />} />
            </Route>
            <Route path="/" element={<Login />} />
        </Routes>

    )
}

export default AppRoutes;