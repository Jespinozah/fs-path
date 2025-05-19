import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function AddIncomePopup({ onClose, onAddIncome }) {
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0],
    bankAccountId: "",
    notes: "",
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
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
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;
    if (!formData.source || !formData.amount || !formData.date || !formData.bankAccountId) {
      alert("Please fill out all required fields.");
      return;
    }
    const payload = {
      user_id: parseInt(userId, 10),
      source: formData.source,
      amount: parseFloat(formData.amount),
      date: formData.date,
      bank_account_id: formData.bankAccountId,
      notes: formData.notes,
    };
    try {
      const res = await fetch(`${API_URL}/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newIncome = await res.json();
        onAddIncome(newIncome);
        onClose();
      } else {
        alert("Failed to add income.");
      }
    } catch {
      alert("Error adding income.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Income</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Income Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder='e.g., "Salary", "Freelance"'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setFormData((prev) => ({ ...prev, amount: value }));
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date Received</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bank Account</label>
          <select
            name="bankAccountId"
            value={formData.bankAccountId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.alias || acc.bank_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Add any notes here..."
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
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Income
          </button>
        </div>
      </div>
    </div>
  );
}
