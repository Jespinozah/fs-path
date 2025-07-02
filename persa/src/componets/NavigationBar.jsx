import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NavigationBar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="flex w-full items-center justify-between bg-gray-800 px-5 py-3 text-white shadow-md">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-white">My App</h2>
        <button
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          onClick={() => navigate("/success")}
        >
          Home
        </button>
        <button
          className="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => navigate("/expenses")}
        >
          Expenses
        </button>
        <button
          className="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => navigate("/income")}
        >
          Income
        </button>
        <button
          className="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => navigate("/bank-accounts")}
        >
          Bank Accounts
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 font-bold text-white hover:bg-gray-500"
          onClick={() => navigate("/profile")}
        >
          U
        </button>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
