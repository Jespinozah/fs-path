import React, { useState } from "react";
import { API_URL } from "../config";

export default function AddExpensePopup({ onClose, onAddExpense }) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0],
    description: "",
  });

  const handleAddExpense = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      console.error("User ID or token not found, redirecting to login.");
      alert("Please log in to add an expense.");
      return;
    }

    if (newExpense.amount && newExpense.category && newExpense.date) {
      try {
        const expenseData = {
          user_id: parseInt(userId, 10), // Include user_id
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
          onAddExpense({
            ...newExpense,
            id: result.id,
          });
          setNewExpense({ amount: "", category: "", date: "", description: "" });
          onClose(); 
        } else {
          const errorText = await response.text();
          console.error("Failed to add expense:", errorText);
          alert("Failed to add expense: " + errorText);
        }
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Error adding expense.");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Expense</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="text"
            value={newExpense.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setNewExpense({ ...newExpense, amount: value });
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter amount"
            required
            inputMode="decimal"
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
            onClick={onClose}
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
  );
}
