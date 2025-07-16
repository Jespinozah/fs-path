import React, { useState } from "react";

export default function EditBankAccount({ account, onClose, onEditAccount }) {
  const [formData, setFormData] = useState({
    bank_name: account.bank_name || "",
    routing_number: account.routing_number || "",
    account_number: account.account_number || "",
    account_type: account.account_type || "checking",
    alias: account.alias || "",
    balance: account.balance || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/^\d{9}$/.test(formData.routing_number)) {
      errs.routing_number = "Routing number must be exactly 9 digits.";
    }
    if (!/^\d{8,17}$/.test(formData.account_number)) {
      errs.account_number = "Account number must be 8 to 17 digits.";
    }
    return errs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login.");
        return;
      }

      const response = await fetch(`/api/v1/bank-accounts/${account.id}`, {
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
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="w-3/4 rounded-lg bg-white p-6 shadow-lg md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Edit Bank Account
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">Bank Name</label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            className="w-full rounded border p-2"
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
            className={`w-full rounded border p-2 ${errors.routing_number ? "border-red-500" : ""}`}
            placeholder="Enter routing number"
            maxLength={9}
          />
          {errors.routing_number && (
            <p className="mt-1 text-sm text-red-600">{errors.routing_number}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Number</label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            className={`w-full rounded border p-2 ${errors.account_number ? "border-red-500" : ""}`}
            placeholder="Enter account number"
            maxLength={17}
          />
          {errors.account_number && (
            <p className="mt-1 text-sm text-red-600">{errors.account_number}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Account Type</label>
          <select
            name="account_type"
            value={formData.account_type}
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
                setFormData({ ...formData, balance: value });
              }
            }}
            className="w-full rounded border p-2"
            placeholder="Enter balance"
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
