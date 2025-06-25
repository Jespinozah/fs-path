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
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/^\d{9}$/.test(formData.routingNumber)) {
      errs.routingNumber = "Routing number must be exactly 9 digits.";
    }
    if (!/^\d{8,17}$/.test(formData.accountNumber)) {
      errs.accountNumber = "Account number must be 8 to 17 digits.";
    }
    return errs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined }); // Clear error on change
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="w-3/4 rounded-lg bg-white p-6 shadow-lg md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Add New Bank Account
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">Bank Name</label>
          <input
            type="text"
            name="bank"
            value={formData.bank}
            onChange={handleInputChange}
            className="w-full rounded border p-2"
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
            className={`w-full rounded border p-2 ${errors.routingNumber ? "border-red-500" : ""}`}
            placeholder="Enter routing number"
            maxLength={9}
          />
          {errors.routingNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className={`w-full rounded border p-2 ${errors.accountNumber ? "border-red-500" : ""}`}
            placeholder="Enter account number"
            maxLength={17}
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
            placeholder="Enter initial balance"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}
