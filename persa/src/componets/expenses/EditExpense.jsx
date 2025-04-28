import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { API_URL } from "../../config";

export default function EditExpense() {
  const { expenseId } = useParams(); // Get expense ID from URL
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setExpense({
            amount: data.amount.toString(),
            category: data.category,
            date: data.date,
            description: data.description || "",
          });
        } else {
          console.error("Failed to fetch expense:", response.statusText);
          alert("Failed to fetch expense details.");
        }
      } catch (error) {
        console.error("Error fetching expense:", error);
        alert("Error fetching expense details.");
      }
    };

    fetchExpense();
  }, [expenseId, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Retrieve user_id from localStorage
    if (!token || !userId) {
      console.error("No token or user ID found, redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10), // Include user_id in the request body
          amount: parseFloat(expense.amount),
          category: expense.category,
          date: expense.date,
          description: expense.description,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Expense updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/expenses"); // Redirect to the expenses page
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error("Failed to update expense:", errorText);
        alert("Failed to update expense: " + errorText);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Error updating expense.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={() => navigate("/login")} />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
            Edit Expense
          </h1>

          {/* Display success message */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="amount" className="mb-1 font-medium text-gray-700">
                Amount
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={expense.amount}
                onChange={(e) =>
                  setExpense({ ...expense, amount: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                placeholder="Enter amount"
                inputMode="decimal"
                pattern="[0-9]*"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="category"
                className="mb-1 font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={expense.category}
                onChange={(e) =>
                  setExpense({ ...expense, category: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Travel">✈️ Travel</option>
                <option value="Bills">💡 Bills</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="date" className="mb-1 font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={expense.date}
                onChange={(e) =>
                  setExpense({ ...expense, date: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-1 font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={expense.description}
                onChange={(e) =>
                  setExpense({ ...expense, description: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                placeholder="Add any description here..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
