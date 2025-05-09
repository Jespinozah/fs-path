import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { get, put } from "../utils/Api"; // Import the get and put functions

export default function EditBankAccountPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    bank_name: "",
    routing_number: "",
    account_number: "",
    account_type: "checking",
    alias: "",
    balance: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await get(`/bank-accounts/${accountId}`);
        setAccount({
          bank_name: data.bank_name,
          routing_number: data.routing_number,
          account_number: data.account_number,
          account_type: data.account_type,
          alias: data.alias || "",
          balance: data.balance.toString(),
        });
      } catch (error) {
        console.error("Error fetching account:", error);
        alert("Error fetching account details.");
      }
    };

    fetchAccount();
  }, [accountId]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await put(`/bank-accounts/${accountId}`, {
        bank_name: account.bank_name,
        routing_number: account.routing_number,
        account_number: account.account_number,
        account_type: account.account_type,
        alias: account.alias,
        balance: parseFloat(account.balance),
      });
      setSuccessMessage("Bank account updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/bank-accounts");
      }, 2000);
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error updating account.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={() => navigate("/login")} />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
            Edit Bank Account
          </h1>

          {/* Display success message */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="bank_name" className="mb-1 font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                id="bank_name"
                name="bank_name"
                value={account.bank_name}
                onChange={(e) => setAccount({ ...account, bank_name: e.target.value })}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="routing_number" className="mb-1 font-medium text-gray-700">
                Routing Number
              </label>
              <input
                type="text"
                id="routing_number"
                name="routing_number"
                value={account.routing_number}
                onChange={(e) => setAccount({ ...account, routing_number: e.target.value })}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="account_number" className="mb-1 font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                value={account.account_number}
                onChange={(e) => setAccount({ ...account, account_number: e.target.value })}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="account_type" className="mb-1 font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="account_type"
                name="account_type"
                value={account.account_type}
                onChange={(e) => setAccount({ ...account, account_type: e.target.value })}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="alias" className="mb-1 font-medium text-gray-700">
                Alias (Optional)
              </label>
              <input
                type="text"
                id="alias"
                name="alias"
                value={account.alias}
                onChange={(e) => setAccount({ ...account, alias: e.target.value })}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="balance" className="mb-1 font-medium text-gray-700">
                Balance
              </label>
              <input
                type="text"
                id="balance"
                name="balance"
                value={account.balance}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setAccount({ ...account, balance: value });
                  }
                }}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                onClick={() => navigate("/bank-accounts")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}