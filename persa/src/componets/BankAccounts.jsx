import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
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

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("User ID or token not found, redirecting to login.");
          return;
        }

        const response = await fetch(`${API_URL}/bank-accounts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        account.id === updatedAccount.id ? updatedAccount : account
      )
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

      const response = await fetch(`${API_URL}/bank-accounts/${accountToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Account deleted successfully");
        setAccounts(accounts.filter((account) => account.id !== accountToDelete)); // Remove the deleted account from the list
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

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex flex-col items-center p-6">
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Bank Accounts
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table className="w-full text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Account Name
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Account Number
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Bank Name
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200">
                      <p className="block text-sm text-slate-800">
                        {account.alias || account.bank_name}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <p className="block text-sm text-slate-800">
                        {"*".repeat(account.account_number.length - 4) + account.account_number.slice(-4)}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <p className="block text-sm text-slate-800">
                        {account.bank_name}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <button
                        onClick={() => handleEdit(account)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mr-2 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(account.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 text-sm font-semibold"
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
        className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">Do you really want to delete this bank account? This action cannot be undone.</p>
            <div className="flex justify-center">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-transparent text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
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