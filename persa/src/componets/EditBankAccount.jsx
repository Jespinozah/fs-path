import React, { useState } from "react";
import { API_URL } from "../config";

export default function EditBankAccount({ account, onClose, onEditAccount }) {
  const [formData, setFormData] = useState({
    bank_name: account.bank_name || "",
    routing_number: account.routing_number || "",
    account_number: account.account_number || "",
    account_type: account.account_type || "checking",
    alias: account.alias || "",
    balance: account.balance || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login.");
        return;
      }

      const response = await fetch(`${API_URL}/bank-accounts/${account.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bank_name: formData.bank_name,
          routing_number: formData.routing_number,
          account_number: formData.account_number,
          account_type: formData.account_type,
          alias: formData.alias,
          balance: parseFloat(formData.balance),
        }),
      });

      if (response.ok) {
        const updatedAccount = await response.json();
        onEditAccount(updatedAccount); // Pass updated account to parent
        onClose();
      } else {
        console.error("Failed to update account:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Bank Account</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Bank Name</label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter bank name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Routing Number</label>
          <input
            type="text"
            name="routing_number"
            value={formData.routing_number}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter routing number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Number</label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter account number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <select
            name="account_type"
            value={formData.account_type}
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
                setFormData({ ...formData, balance: value });
              }
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter balance"
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}