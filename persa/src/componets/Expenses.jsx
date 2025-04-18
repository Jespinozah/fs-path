import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
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
            data.map((expense) => ({
              ...expense,
              icon: getCategoryIcon(expense.category), // Add icon based on category
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

  const handleEdit = (expenseId) => {
    navigate(`/edit-expense/${expenseId}`); // Redirect to edit expense page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={() => navigate("/login")} />
      <div className="flex flex-col items-center p-6">
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            All Expenses
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Category</th> {/* Remove separate Icon column */}
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {expense.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="flex items-center">
                      <span className="text-xl mr-2">{expense.icon}</span> {/* Display icon next to category */}
                      {expense.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {expense.description || "N/A"}
                  </td>
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
    </div>
  );
}
