import React, { useState } from "react";

export default function AddExpensePopup({ onClose, onAddExpense }) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0],
    time: new Date().toTimeString().split(" ")[0],
    description: "",
  });

  const handleAddExpense = () => {
    if (
      newExpense.amount &&
      newExpense.category &&
      newExpense.date &&
      newExpense.time
    ) {
      onAddExpense(newExpense);
      setNewExpense({
        amount: "",
        category: "",
        date: "",
        time: "",
        description: "",
      });
      onClose();
    } else {
      alert("Please fill out all required fields, including time.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Add Expense
        </h2>
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
