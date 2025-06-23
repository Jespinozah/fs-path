import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { get, put } from "../../utils/Api"; // Import the get and put functions

export default function EditExpense() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    hour: "", // Add hour field
    description: "",
    bank_account_id: "", // Add bank account field
  });
  const [accounts, setAccounts] = useState([]); // State for bank accounts
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch bank accounts using the get utility
    const fetchAccounts = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const data = await get(`/bank-accounts/user/${userId}`);
        setAccounts(Array.isArray(data) ? data : data.accounts || []);
      } catch {
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await get(`/expenses/${expenseId}`);
        setExpense({
          amount: data.amount.toString(),
          category: data.category,
          date: data.date,
          hour: data.hour || "", // Set hour if available
          description: data.description || "",
          bank_account_id: data.bank_account_id || "", // Set bank account if available
        });
      } catch (error) {
        console.error("Error fetching expense:", error);
        alert("Error fetching expense details.");
      }
    };

    fetchExpense();
  }, [expenseId]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await put(`/expenses/${expenseId}`, {
        user_id: parseInt(localStorage.getItem("userId"), 10),
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: expense.date,
        hour: expense.hour, // Include hour in the request
        description: expense.description,
        bank_account_id: expense.bank_account_id, // Include bank account
      });
      setSuccessMessage("Expense updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/expenses");
      }, 2000);
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Error updating expense.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={() => navigate("/login")} />
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mt-6 w-3/4 rounded-lg bg-white p-6 shadow-md md:w-1/2">
          <h1 className="mb-4 text-center text-2xl font-semibold text-gray-700">
            Edit Expense
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
                htmlFor="amount"
                className="mb-1 font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={expense.amount}
                onChange={(e) =>
                  setExpense({ ...expense, amount: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                placeholder="Enter amount"
                inputMode="decimal"
                pattern="[0-9]*"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="category"
                className="mb-1 font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={expense.category}
                onChange={(e) =>
                  setExpense({ ...expense, category: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                required
              >
                <option value="">Select Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Travel">✈️ Travel</option>
                <option value="Bills">💡 Bills</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="date" className="mb-1 font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={expense.date}
                onChange={(e) =>
                  setExpense({ ...expense, date: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="hour" className="mb-1 font-medium text-gray-700">
                Hour
              </label>
              <input
                type="time"
                id="hour"
                name="hour"
                value={expense.hour}
                onChange={(e) =>
                  setExpense({ ...expense, hour: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-1 font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={expense.description}
                onChange={(e) =>
                  setExpense({ ...expense, description: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                placeholder="Add any description here..."
              ></textarea>
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
                value={expense.bank_account_id}
                onChange={(e) =>
                  setExpense({ ...expense, bank_account_id: e.target.value })
                }
                className="rounded border bg-gray-50 p-2 text-gray-700"
                required
              >
                <option value="">Select Bank Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bank_name || `Account #${acc.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                onClick={() => navigate("/expenses")} // Navigate back to the expenses page
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
