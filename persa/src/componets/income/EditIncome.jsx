import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { API_URL } from "../../config";

export default function EditIncome() {
  const { incomeId } = useParams();
  const navigate = useNavigate();
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    bank_account_id: "",
    notes: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

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
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    // Fetch income details
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_URL}/incomes/${incomeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setIncome({
            source: data.source || "",
            amount: data.amount?.toString() || "",
            date: data.date || "",
            bank_account_id: data.bank_account_id || data.bank_account || "",
            notes: data.notes || "",
          });
        } else {
          alert("Error fetching income details.");
        }
      } catch (error) {
        console.error("Error fetching income details:", error);
        alert("Error fetching income details.");
      }
    };
    fetchIncome();
  }, [incomeId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/incomes/${incomeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          source: income.source,
          amount: parseFloat(income.amount),
          date: income.date,
          bank_account_id: parseInt(income.bank_account_id, 10),
          notes: income.notes,
        }),
      });
      if (res.ok) {
        setSuccessMessage("Income updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/income");
        }, 2000);
      } else {
        alert("Error updating income.");
      }
    } catch (error) {
      console.error("Error updating income:", error);
      alert("Error updating income.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
            Edit Income
          </h1>
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="source"
                className="mb-1 font-medium text-gray-700"
              >
                Source
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={income.source}
                onChange={(e) =>
                  setIncome({ ...income, source: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                placeholder="Enter source"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="amount"
                className="mb-1 font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={income.amount}
                onChange={(e) =>
                  setIncome({ ...income, amount: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                placeholder="Enter amount"
                inputMode="decimal"
                pattern="[0-9]*"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="date" className="mb-1 font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={income.date}
                onChange={(e) => setIncome({ ...income, date: e.target.value })}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="bank_account_id"
                className="mb-1 font-medium text-gray-700"
              >
                Bank Account
              </label>
              <select
                id="bank_account_id"
                name="bank_account_id"
                value={income.bank_account_id}
                onChange={(e) =>
                  setIncome({ ...income, bank_account_id: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
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
            <div className="flex flex-col">
              <label htmlFor="notes" className="mb-1 font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={income.notes}
                onChange={(e) =>
                  setIncome({ ...income, notes: e.target.value })
                }
                className="border p-2 bg-gray-50 text-gray-700 rounded"
                placeholder="Add any notes here..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                onClick={() => navigate("/income")}
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
