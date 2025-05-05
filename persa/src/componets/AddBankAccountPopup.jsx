import React, { useState } from "react";

export default function AddBankAccountPopup({ onClose, onAddAccount }) {
  const [formData, setFormData] = useState({
    name: "",
    bank: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
    alias: "", // Added alias field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onAddAccount({ ...formData });
    onClose();
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