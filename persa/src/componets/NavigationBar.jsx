import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationBar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex w-full items-center justify-between bg-gray-800 px-5 py-3 text-white shadow-md">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-white">My App</h2>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            isActive("/success")
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => navigate("/success")}
        >
          Home
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            isActive("/expenses")
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => navigate("/expenses")}
        >
          Expenses
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            isActive("/income")
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => navigate("/income")}
        >
          Income
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            isActive("/bank-accounts")
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
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
