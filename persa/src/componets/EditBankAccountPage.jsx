import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditBankAccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state?.account || {
    name: "",
    bank: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
    alias: "",
  };

  const [formData, setFormData] = useState(account);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Updated Account:", formData);
    // Logic to update the account in the backend
    navigate("/bank-accounts"); // Redirect back to the bank accounts page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Bank Account</h2>

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
            onClick={() => navigate("/bank-accounts")}
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