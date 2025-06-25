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
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const errs = {};
    if (!/^\d{9}$/.test(account.routing_number)) {
      errs.routing_number = "Routing number must be exactly 9 digits.";
    }
    if (!/^\d{8,17}$/.test(account.account_number)) {
      errs.account_number = "Account number must be 8 to 17 digits.";
    }
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mt-6 w-3/4 rounded-lg bg-white p-6 shadow-md md:w-1/2">
          <h1 className="mb-4 text-center text-2xl font-semibold text-gray-700">
            Edit Bank Account
          </h1>

          {/* Display success message */}
          {successMessage && (
            <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="bank_name"
                className="mb-1 font-medium text-gray-700"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bank_name"
                name="bank_name"
                value={account.bank_name}
                onChange={(e) =>
                  setAccount({ ...account, bank_name: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="routing_number"
                className="mb-1 font-medium text-gray-700"
              >
                Routing Number
              </label>
              <input
                type="text"
                id="routing_number"
                name="routing_number"
                value={account.routing_number}
                onChange={(e) => {
                  setAccount({ ...account, routing_number: e.target.value });
                  setErrors({ ...errors, routing_number: undefined });
                }}
                className={`rounded border bg-gray-50 p-2 text-gray-700 ${errors.routing_number ? "border-red-500" : ""}`}
                required
                maxLength={9}
              />
              {errors.routing_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.routing_number}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="account_number"
                className="mb-1 font-medium text-gray-700"
              >
                Account Number
              </label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                value={account.account_number}
                onChange={(e) => {
                  setAccount({ ...account, account_number: e.target.value });
                  setErrors({ ...errors, account_number: undefined });
                }}
                className={`rounded border bg-gray-50 p-2 text-gray-700 ${errors.account_number ? "border-red-500" : ""}`}
                required
                maxLength={17}
              />
              {errors.account_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.account_number}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="account_type"
                className="mb-1 font-medium text-gray-700"
              >
                Account Type
              </label>
              <select
                id="account_type"
                name="account_type"
                value={account.account_type}
                onChange={(e) =>
                  setAccount({ ...account, account_type: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
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
                onChange={(e) =>
                  setAccount({ ...account, alias: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="balance"
                className="mb-1 font-medium text-gray-700"
              >
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
                className="rounded border bg-gray-50 p-2 text-gray-700"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                onClick={() => navigate("/bank-accounts")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
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
