import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar";
import AddIncomePopup from "./AddIncomePopup";
import { API_URL } from "../../config";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Add icons
import { useNavigate } from "react-router-dom";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) return;
        const res = await fetch(
          `${API_URL}/bank-accounts/users/${userId}/incomes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          // Support both array and object response
          let incomeList = [];
          if (Array.isArray(data)) {
            incomeList = data;
          } else if (data.incomes) {
            incomeList = data.incomes;
          }
          setIncomes(incomeList);
        } else {
          setIncomes([]);
        }
      } catch (e) {
        console.error("Error fetching incomes:", e);
        setIncomes([]);
      }
    };
    fetchIncomes();
  }, [showAddPopup]);

  const handleAddIncome = (newIncome) => {
    setIncomes([...incomes, newIncome]);
  };

  const confirmDelete = (incomeId) => {
    setIncomeToDelete(incomeId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/incomes/${incomeToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIncomes(incomes.filter((income) => income.id !== incomeToDelete));
        setShowDeleteConfirm(false);
        setIncomeToDelete(null);
      } else {
        alert("Failed to delete income.");
      }
    } catch (e) {
      console.error("Error deleting income:", e);
      alert("Error deleting income.");
    }
  };

  const handleEditIncome = (income) => {
    // Fix: navigate to the correct route for EditIncome (should match your router path)
    navigate(`/income/${income.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex flex-col items-center p-6">
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Income</h2>
          <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table className="w-full text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Source
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Amount
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Date Received
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Bank Account
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Notes
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-300 bg-slate-50 text-center">
                    <p className="block text-sm font-normal leading-none text-slate-500">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {incomes.length > 0 ? (
                  incomes.map((income) => (
                    <tr key={income.id} className="hover:bg-slate-50">
                      <td className="p-4 border-b border-slate-200">
                        <p className="block text-sm text-slate-800">
                          {income.source}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="block text-sm text-green-700 font-semibold">
                          +${parseFloat(income.amount).toFixed(2)}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="block text-sm text-slate-800">
                          {income.date}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="block text-sm text-slate-800">
                          {income.bank_account_name ||
                            income.bank_account_alias ||
                            income.bank_account ||
                            ""}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="block text-sm text-slate-800">
                          {income.notes || ""}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex flex-row items-center">
                          <button
                            onClick={() => handleEditIncome(income)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mr-2 text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(income.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No income records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowAddPopup(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
        title="Add Income"
      >
        <FaPlus />
      </button>
      {showAddPopup && (
        <AddIncomePopup
          onClose={() => setShowAddPopup(false)}
          onAddIncome={handleAddIncome}
        />
      )}
      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">
              Do you really want to delete this income? This action cannot be
              undone.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteIncome}
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
