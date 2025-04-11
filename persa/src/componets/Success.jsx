import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Success() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(
            data.map((expense) => ({
              id: expense.id,
              category: expense.category,
              amount: expense.amount,
              date: expense.date, // Add date field
              icon: getCategoryIcon(expense.category), // Map category to an icon
            }))
          );
        } else {
          console.error("Failed to fetch expenses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [navigate]);

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍔",
      Travel: "✈️",
      Bills: "💡",
    };
    return icons[category] || "💸"; // Default icon
  };

  useEffect(() => {
    const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);
    setBalance(-totalExpenses);
  }, [transactions]);

  // Pie chart data
  const chartData = {
    labels: [...new Set(transactions.map((t) => t.category))], // Unique categories
    datasets: [
      {
        data: [...new Set(transactions.map((t) => t.category))].map((category) =>
          transactions
            .filter((t) => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0) // Sum amounts for each category
        ),
        backgroundColor: [...new Set(transactions.map((t) => t.category))].map(
          (_, index) => `hsl(${(index * 60) % 360}, 70%, 70%)` // Generate dynamic colors
        ),
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

  const [showAddExpensePopup, setShowAddExpensePopup] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.category && newExpense.date) {
      setTransactions([
        ...transactions,
        {
          ...newExpense,
          id: transactions.length + 1,
          amount: parseFloat(newExpense.amount),
        },
      ]);
      setShowAddExpensePopup(false);
      setNewExpense({ amount: "", category: "", date: "", description: "" });
    } else {
      alert("Please fill out all required fields.");
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
                <span className="text-gray-500 text-sm">{t.date}</span> {/* Display date first */}
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
          onClick={() => setShowAddExpensePopup(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
        >
          +
        </button>
      </div>

      {/* Add Expense Popup */}
      {showAddExpensePopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Add Expense
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Travel">✈️ Travel</option>
                <option value="Bills">💡 Bills</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description (Optional)</label>
              <textarea
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Add any description here..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddExpensePopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
