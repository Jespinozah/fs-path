import React, { useState } from "react";
import { API_URL } from "../config";

export default function AddBankAccountPopup({ onClose, onAddAccount }) {
  const [formData, setFormData] = useState({
    bank: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
    alias: "",
    balance: "", // Added balance field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("User ID or token not found, redirecting to login.");
        return;
      }

      const response = await fetch(`${API_URL}/bank-accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          bank_name: formData.bank,
          routing_number: formData.routingNumber,
          account_number: formData.accountNumber,
          account_type: formData.accountType,
          alias: formData.alias,
          balance: parseFloat(formData.balance) || 0,
        }),
      });

      if (response.ok) {
        const newAccount = await response.json();
        onAddAccount(newAccount); // Pass the new account to the parent component
        onClose();
      } else {
        console.error("Failed to add account:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Bank Account</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Bank Name</label>
          <input
            type="text"
            name="bank"
            value={formData.bank}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter bank name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Routing Number</label>
          <input
            type="text"
            name="routingNumber"
            value={formData.routingNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter routing number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter account number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Alias (Optional)</label>
          <input
            type="text"
            name="alias"
            value={formData.alias}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter an alias for the account (optional)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Balance</label>
          <input
            type="text"
            name="balance"
            value={formData.balance}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setFormData({ ...formData, balance: value }); // Allow only numeric input
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter initial balance"
          />
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
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}