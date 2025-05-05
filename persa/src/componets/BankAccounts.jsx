import React, { useState } from "react";
import { FaPlus } from "react-icons/fa"; // Import the FaPlus icon
import NavigationBar from "./NavigationBar";
import AddBankAccountPopup from "./AddBankAccountPopup";
import EditBankAccount from "./EditBankAccount"; // Import the EditBankAccount component

export default function BankAccounts() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false); // State for showing edit popup
  const [selectedAccount, setSelectedAccount] = useState(null); // State for selected account

  const accounts = [
    { id: 1, name: "Savings Account", number: "123456789", bank: "Bank A" },
    { id: 2, name: "Checking Account", number: "987654321", bank: "Bank B" },
    { id: 3, name: "Business Account", number: "456789123", bank: "Bank C" },
  ];

  const handleAddAccount = (newAccount) => {
    console.log("New Account Added:", newAccount);
    // Logic to add the new account to the list or backend
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setShowEditPopup(true);
  };

  const handleEditAccount = (updatedAccount) => {
    console.log("Updated Account:", updatedAccount);
    // Logic to update the account in the list or backend
  };

  const handleDelete = (id) => {
    console.log("Delete Account ID:", id);
    // Logic to delete the account
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
                  <td className="border border-gray-300 px-4 py-2">{account.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {"*".repeat(account.number.length - 4) + account.number.slice(-4)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{account.bank}</td>
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