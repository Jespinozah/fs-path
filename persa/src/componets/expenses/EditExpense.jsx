import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { get, put } from "../../utils/Api"; // Import the get and put functions

export default function EditExpense() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    hour: "", // Add hour field
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await get(`/expenses/${expenseId}`);
        setExpense({
          amount: data.amount.toString(),
          category: data.category,
          date: data.date,
          hour: data.hour || "", // Set hour if available
          description: data.description || "",
        });
      } catch (error) {
        console.error("Error fetching expense:", error);
        alert("Error fetching expense details.");
      }
    };

    fetchExpense();
  }, [expenseId]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await put(`/expenses/${expenseId}`, {
        user_id: parseInt(localStorage.getItem("userId"), 10),
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: expense.date,
        hour: expense.hour, // Include hour in the request
        description: expense.description,
      });
      setSuccessMessage("Expense updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/expenses");
      }, 2000);
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
              <label htmlFor="hour" className="mb-1 font-medium text-gray-700">
                Hour
              </label>
              <input
                type="time"
                id="hour"
                name="hour"
                value={expense.hour}
                onChange={(e) =>
                  setExpense({ ...expense, hour: e.target.value })
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                onClick={() => navigate("/expenses")} // Navigate back to the expenses page
              >
                Cancel
              </button>
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
