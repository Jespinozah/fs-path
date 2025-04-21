import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";
import AddExpensePopup from "./AddExpensePopup";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showAddExpensePopup, setShowAddExpensePopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

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
          setExpenses(
            data
              .map((expense) => ({
                ...expense,
                icon: getCategoryIcon(expense.category),
              }))
              .sort((a, b) => new Date(b.date) - new Date(a.date))
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
    return icons[category] || "💸";
  };

  const handleAddExpense = async (newExpense) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("User ID or token not found, redirecting to login.");
        navigate("/login");
        return;
      }

      const expenseData = {
        user_id: parseInt(userId, 10),
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        description: newExpense.description,
      };

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
        setExpenses([
          {
            ...newExpense,
            id: result.id,
            amount: parseFloat(newExpense.amount),
            icon: getCategoryIcon(newExpense.category),
          },
          ...expenses,
        ]);
        setShowAddExpensePopup(false);
        setSuccessMessage("Expense added successfully!"); // Set success message
        setTimeout(() => setSuccessMessage(""), 2000); // Clear success message after 2 seconds
      } else {
        const errorText = await response.text();
        console.error("Failed to add expense:", errorText);
        alert("Failed to add expense: " + errorText);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error adding expense");
    }
  };

  const handleEdit = (expenseId) => {
    navigate(`/expenses/${expenseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={() => navigate("/login")} />
      <div className="flex flex-col items-center p-6">
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            All Expenses
          </h2>

          {/* Display success message */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={expense.id || index}>{/* Ensure no extra whitespace */}
                  <td className="border border-gray-300 px-4 py-2">{expense.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="flex items-center">
                      <span className="text-xl mr-2">{expense.icon}</span>
                      {expense.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">${expense.amount.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{expense.description || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(expense.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Add Expense Button */}
      <button
        onClick={() => setShowAddExpensePopup(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
        title="Add Expense"
      >
        +
      </button>

      {/* Add Expense Popup */}
      {showAddExpensePopup && (
        <AddExpensePopup
          onClose={() => setShowAddExpensePopup(false)}
          onAddExpense={handleAddExpense}
        />
      )}
    </div>
  );
}
