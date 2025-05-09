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
    console.log("New Account Added:", newAccount);
    setAccounts([...accounts, newAccount]); // Add the new account to the list
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setShowEditPopup(true);
  };

  const handleEditAccount = (updatedAccount) => {
    console.log("Updated Account:", updatedAccount);
    setAccounts(
      accounts.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login.");
        return;
      }

      const response = await fetch(`${API_URL}/bank-accounts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Account deleted successfully");
        setAccounts(accounts.filter((account) => account.id !== id)); // Remove the deleted account from the list
      } else {
        console.error("Failed to delete account:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
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

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Account Name</th>
                <th className="border border-gray-300 px-4 py-2">Account Number</th>
                <th className="border border-gray-300 px-4 py-2">Bank Name</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="border border-gray-300 px-4 py-2">{account.alias || account.bank_name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {"*".repeat(account.account_number.length - 4) + account.account_number.slice(-4)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{account.bank_name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
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
    </div>
  );
}