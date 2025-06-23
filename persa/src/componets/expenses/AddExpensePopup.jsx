import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function AddExpensePopup({ onClose, onAddExpense }) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0],
    time: new Date().toTimeString().split(" ")[0],
    description: "",
    bank_account_id: "",
  });

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch bank accounts
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;
      const res = await fetch(`${API_URL}/bank-accounts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(Array.isArray(data) ? data : data.accounts || []);
      } else {
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddExpense = () => {
    if (
      newExpense.amount &&
      newExpense.category &&
      newExpense.date &&
      newExpense.time &&
      newExpense.bank_account_id
    ) {
      onAddExpense(newExpense);
      setNewExpense({
        amount: "",
        category: "",
        date: "",
        time: "",
        description: "",
        bank_account_id: "",
      });
      onClose();
    } else {
      alert(
        "Please fill out all required fields, including time and bank account.",
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="w-3/4 rounded-lg bg-white p-6 shadow-lg md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
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
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
            placeholder="Add any description here..."
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bank Account</label>
          <select
            value={newExpense.bank_account_id}
            onChange={(e) =>
              setNewExpense({ ...newExpense, bank_account_id: e.target.value })
            }
            className="w-full rounded border p-2"
            required
          >
            <option value="">Select Bank Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.bank_name || `Account #${acc.id}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpense}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
