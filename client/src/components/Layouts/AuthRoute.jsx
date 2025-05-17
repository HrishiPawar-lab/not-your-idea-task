import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
    const isAuthorized = localStorage.getItem("token");

    if (isAuthorized) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default AuthRoute;
