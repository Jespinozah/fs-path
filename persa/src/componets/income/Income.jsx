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
          },
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
        <div className="w-full rounded-lg bg-white p-6 shadow-md md:w-3/4">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Income</h2>
          <div className="relative flex h-full w-full flex-col overflow-scroll rounded-lg bg-white bg-clip-border text-gray-700 shadow-md">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Source
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Amount
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Date Received
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Bank Account
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Notes
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4 text-center">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {incomes.length > 0 ? (
                  incomes.map((income) => (
                    <tr key={income.id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 p-4">
                        <p className="block text-sm text-slate-800">
                          {income.source}
                        </p>
                      </td>
                      <td className="border-b border-slate-200 p-4">
                        <p className="block text-sm font-semibold text-green-700">
                          +${parseFloat(income.amount).toFixed(2)}
                        </p>
                      </td>
                      <td className="border-b border-slate-200 p-4">
                        <p className="block text-sm text-slate-800">
                          {income.date}
                        </p>
                      </td>
                      <td className="border-b border-slate-200 p-4">
                        <p className="block text-sm text-slate-800">
                          {income.bank_account_name || ""}
                        </p>
                      </td>
                      <td className="border-b border-slate-200 p-4">
                        <p className="block text-sm text-slate-800">
                          {income.notes || ""}
                        </p>
                      </td>
                      <td className="border-b border-slate-200 p-4">
                        <div className="flex flex-row items-center">
                          <button
                            onClick={() => handleEditIncome(income)}
                            className="mr-2 rounded bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(income.id)}
                            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
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
        className="fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-3xl text-white shadow-lg hover:bg-indigo-600"
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
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Are you sure?</h3>
            <p className="mb-6">
              Do you really want to delete this income? This action cannot be
              undone.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteIncome}
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
