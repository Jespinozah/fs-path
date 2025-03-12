import React from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-4xl font-bold text-green-700">Success!</h1>
      <p className="text-lg text-gray-700 mt-2">You have successfully logged in or signed up.</p>
      <button
        className="mt-5 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        onClick={() => navigate("/login")}
      >
        Go to Login
      </button>
    </div>
  );
}