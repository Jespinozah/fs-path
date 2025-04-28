import React from "react";
import { useNavigate } from "react-router-dom";

export default function Failure() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-red-700">Failed!</h1>
      <p className="text-lg text-gray-700 mt-2">Something went wrong. Please try again.</p>
      <button
        className="mt-5 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
        onClick={() => navigate(-1)}
      >
        Try Again
      </button>
    </div>
  );
}