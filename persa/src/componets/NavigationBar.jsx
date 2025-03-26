import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavigationBar({ onLogout }) {
    const navigate = useNavigate();

    return (
        <nav className="w-full bg-blue-600 text-white py-3 px-5 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">My App</h2>
                <button
                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400"
                    onClick={() => navigate("/")}
                >
                    Home
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    className="w-10 h-10 bg-white text-blue-600 flex items-center justify-center rounded-full font-bold hover:bg-gray-200"
                    onClick={() => navigate("/profile")}
                >
                    U
                </button>
                <button
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-400"
                    onClick={onLogout}
                >
                    Log Out
                </button>
            </div>
        </nav>
    );
}
