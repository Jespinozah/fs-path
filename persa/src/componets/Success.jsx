import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FiPlus } from 'react-icons/fi';
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation(); // Access location state
  const initialSuccessMessage = location.state?.message; // Get success message if available
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State for selected transaction

  useEffect(() => {
    if (initialSuccessMessage) {
      setShowSuccessPopup(true);
      const timer = setTimeout(() => setShowSuccessPopup(false), 2000); // Hide after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [location.state?.message]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/expenses?page=1&per_page=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched expenses data:", data); // Log the response data

          if (Array.isArray(data.expenses)) { // Access the 'expenses' key
            setTransactions(
              data.expenses
                .map((expense) => ({
                  id: expense.id,
                  category: expense.category,
                  amount: expense.amount,
                  date: expense.date, // Add date field
                  icon: getCategoryIcon(expense.category), // Map category to an icon
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (descending)
            );
          } else {
            console.error("Unexpected data format:", data);
            alert("Failed to fetch expenses: Unexpected data format.");
          }
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
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0],
    time: new Date().toTimeString().split(" ")[0], // Set current time in HH:mm:ss format
    description: "",
  });

  const handleAddExpense = async () => {
    if (newExpense.amount && newExpense.category && newExpense.date && newExpense.time) {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("User ID or token not found, redirecting to login.");
          navigate("/login");
          return;
        }

        const expenseData = {
          user_id: parseInt(userId, 10), // Include user_id
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date, // Send only the date part
          hour: newExpense.time, // Send the time part as 'hour'
          description: newExpense.description,
        };

        console.log("Payload being sent:", expenseData); // Log the payload

        const response = await fetch(`${API_URL}/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(expenseData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Expense Saved:", result);
          setTransactions([
            ...transactions,
            {
              ...newExpense,
              id: result.id, // Use the ID returned from the backend
              amount: parseFloat(newExpense.amount),
              category: newExpense.category,
              date: newExpense.date,
              icon: getCategoryIcon(newExpense.category), // Map category to an icon
            },
          ]);
          setNewExpense({ amount: "", category: "", date: "", time: "", description: "" });
          setSuccessMessage("Expense added successfully!");
          setShowSuccessPopup(true);
          setTimeout(() => setShowSuccessPopup(false), 2000); // Hide success message after 2 seconds
        } else {
          const errorText = await response.text();
          console.error("Failed to add expense:", errorText);
          alert("Failed to add expense: " + errorText);
        }
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Error adding expense");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  const handleTransactionClick = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/expenses/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTransaction(data); // Set the full transaction details, including description
      } else {
        console.error("Failed to fetch transaction details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
            {transactions.slice(0, 8).map(
              (
                t // Show the first 8 most recent transactions
              ) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center py-2 border-b cursor-pointer"
                  onClick={() => handleTransactionClick(t.id)} // Fetch transaction details on click
                >
                  <span className="text-gray-500 text-sm">{t.date}</span>{" "}
                  {/* Display date first */}
                  <span className="flex items-center">
                    <span className="text-xl">{t.icon}</span>
                    <span className="ml-2 text-gray-700">{t.category}</span>
                  </span>
                  <span className="font-medium text-red-500">
                    - ${t.amount.toFixed(2)}
                  </span>
                </li>
              )
            )}
          </ul>
          <button
            onClick={() => navigate("/expenses")} // Redirect to the Expenses page
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            See More
          </button>
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
          title="Add Expense"
        >
          <FiPlus />
        </button>
      </div>

      {/* Add Expense Popup */}
      {showAddExpensePopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Add Expense
            </h2>

            {/* Success Message */}
            {showSuccessPopup && (
              <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
                {successMessage}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="text" // Change to text to prevent scroll behavior
                value={newExpense.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    // Allow only numeric input
                    setNewExpense({ ...newExpense, amount: value });
                  }
                }}
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
                required
                inputMode="decimal" // Ensure numeric keyboard on mobile
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
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                value={newExpense.time || ""}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, time: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
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

      {/* Transaction Description Popup */}
      {selectedTransaction && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Transaction Details
            </h2>
            <p>
              <strong>Date:</strong> {selectedTransaction.date}
            </p>
            <p>
              <strong>Hour:</strong> {selectedTransaction.hour || "N/A"}
            </p>
            <p>
              <strong>Category:</strong> {selectedTransaction.category}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedTransaction.description || "No description provided."}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedTransaction(null)} // Close popup
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
