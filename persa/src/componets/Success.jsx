import React from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Success() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found.");
        return;
      }

      // Send logout request to backend API
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
        credentials: "include", // Include cookies if applicable
      });

      if (response.ok) {
        // Successfully logged out
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-green-700 text-white py-3 px-5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">My App</h2>
          <button
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-400"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="w-10 h-10 bg-white text-green-700 flex items-center justify-center rounded-full font-bold hover:bg-gray-200"
            onClick={() => navigate("/profile")}
          >
            U
          </button>
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-400"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Success Message */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold text-green-700">Success!</h1>
        <p className="text-lg text-gray-700 mt-2">
          You have successfully logged in or signed up.
        </p>
      </div>
    </div>
  );
}