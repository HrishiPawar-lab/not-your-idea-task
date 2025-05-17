import React from "react";
import Button from "../GlobalComponents/Button";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/HttpClient";

const Header = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        delete axiosInstance.defaults.headers.common["Authorization"];
        localStorage.clear()
        navigate("/login")
    };

    return (
        <header className="flex rounded-md justify-between items-center px-6 py-4 bg-orange-100 shadow-md">
            <h1 className="text-xl font-semibold text-orange-700">Hello 👋</h1>
            <Button
                onClick={handleLogout}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition max-w-fit"
            >
                Logout
            </Button>
        </header>
    );
};

export default Header;
