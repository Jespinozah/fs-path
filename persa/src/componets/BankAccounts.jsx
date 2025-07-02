import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import NavigationBar from "./NavigationBar";
import AddBankAccountPopup from "./AddBankAccountPopup";
import EditBankAccount from "./EditBankAccount";
import { API_URL } from "../config";

export default function BankAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [filter, setFilter] = useState(""); // Add filter state

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("User ID or token not found, redirecting to login.");
          return;
        }

        const response = await fetch(
          `${API_URL}/bank-accounts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setAccounts(data); // Assume the API returns an array of accounts
        } else {
          console.error("Failed to fetch bank accounts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
    setSuccessMessage("Bank account added successfully!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setShowEditPopup(true);
  };

  const handleEditAccount = (updatedAccount) => {
    setAccounts(
      accounts.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account,
      ),
    );
    setSuccessMessage("Bank account updated successfully!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const confirmDelete = (accountId) => {
    setAccountToDelete(accountId);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login.");
        return;
      }

      const response = await fetch(
        `${API_URL}/bank-accounts/${accountToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        console.log("Account deleted successfully");
        setAccounts(
          accounts.filter((account) => account.id !== accountToDelete),
        ); // Remove the deleted account from the list
      } else {
        console.error("Failed to delete account:", response.statusText);
      }
      setShowDeleteConfirm(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      setShowDeleteConfirm(false);
      setAccountToDelete(null);
    }
  };

  // Filtered accounts based on filter input
  const filteredAccounts = accounts.filter((account) => {
    const search = filter.trim().toLowerCase();
    if (!search) return true;
    const alias = (account.alias || "").toLowerCase();
    const bankName = (account.bank_name || "").toLowerCase();
    const accountNumber = account.account_number || "";
    // Match alias, bank name, or last 4 digits of account number
    return (
      alias.includes(search) ||
      bankName.includes(search) ||
      accountNumber.slice(-4).includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex flex-col items-center p-6">
        <div className="w-full rounded-lg bg-white p-6 shadow-md md:w-5/6">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Bank Accounts
          </h2>

          {/* Filter Input with Search Icon and Reset Button */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative w-full">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by account name, bank, or last 4 digits"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 pl-10 text-gray-700"
              />
            </div>
            {filter && (
              <button
                type="button"
                className="rounded bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                onClick={() => setFilter("")}
              >
                Reset
              </button>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-green-700">
              {successMessage}
            </div>
          )}

          <div className="relative flex h-full w-full flex-col overflow-scroll rounded-lg bg-white bg-clip-border text-gray-700 shadow-md">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Account Name
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Account Number
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Bank Name
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Balance
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50">
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {account.alias || account.bank_name}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {"*".repeat(account.account_number.length - 4) +
                          account.account_number.slice(-4)}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {account.bank_name}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {account.balance !== undefined
                          ? `$${Number(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "--"}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <button
                        onClick={() => handleEdit(account)}
                        className="mr-2 rounded bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(account.id)}
                        className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowAddPopup(true)}
        className="fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-3xl text-white shadow-lg hover:bg-indigo-600"
        title="Add Bank Account"
      >
        <FaPlus />
      </button>

      {showAddPopup && (
        <AddBankAccountPopup
          onClose={() => setShowAddPopup(false)}
          onAddAccount={handleAddAccount}
        />
      )}

      {showEditPopup && selectedAccount && (
        <EditBankAccount
          account={selectedAccount}
          onClose={() => setShowEditPopup(false)}
          onEditAccount={handleEditAccount}
        />
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Are you sure?</h3>
            <p className="mb-6">
              Do you really want to delete this bank account? This action cannot
              be undone.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleDelete}
                className="mr-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded bg-transparent px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
