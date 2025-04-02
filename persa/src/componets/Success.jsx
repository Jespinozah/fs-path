import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Success() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([
    { id: 1, category: "Food", amount: 20, icon: "🍔" },
    { id: 2, category: "Travel", amount: 50, icon: "✈️" },
    { id: 3, category: "Bills", amount: 30, icon: "💡" },
  ]);

  useEffect(() => {
    // Calculate total balance (assuming an initial balance of $500)
    const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);
    setBalance(500 - totalExpenses);
  }, [transactions]);

  // Pie chart data
  const chartData = {
    labels: transactions.map((t) => t.category),
    datasets: [
      {
        data: transactions.map((t) => t.amount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <NavigationBar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col items-center p-6">
        {/* Total Balance */}
        <div className="bg-white w-3/4 md:w-1/2 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Balance</h2>
          <p className="text-2xl font-bold text-green-600">
            ${balance.toFixed(2)}
          </p>
        </div>

        {/* Recent Transactions */}
        <div className="w-3/4 md:w-1/2 bg-white p-4 mt-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Transactions
          </h2>
          <ul className="mt-2">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="flex items-center">
                  <span className="text-xl">{t.icon}</span>
                  <span className="ml-2 text-gray-700">{t.category}</span>
                </span>
                <span className="font-medium text-red-500">
                  - ${t.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pie Chart */}
        <div className="w-3/4 md:w-1/2 bg-white p-4 mt-6 rounded-lg shadow-md mx-auto flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Spending by Category
          </h2>
          <div style={{ width: "300px", height: "300px" }}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Floating Add Expense Button */}
        <button
          onClick={() => navigate("/add-expense")}
          className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
        >
          +
        </button>
      </div>
    </div>
  );
}
