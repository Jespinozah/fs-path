import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar";
import AddIncomePopup from "./AddIncomePopup";
import { API_URL } from "../../config";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"; // Add FaSearch
import { useNavigate } from "react-router-dom";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [search, setSearch] = useState(""); // General search bar
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const [filterSource, setFilterSource] = useState(""); // Source/category filter
  const [filterBank, setFilterBank] = useState(""); // Bank filter
  const [bankOptions, setBankOptions] = useState([]); // For bank dropdown
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

  // Fetch bank accounts for filter dropdown
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) return;
        const res = await fetch(`${API_URL}/bank-accounts/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBankOptions(data);
        }
      } catch {
        // ignore
      }
    };
    fetchBanks();
  }, []);

  // Filtered incomes based on all filters
  const filteredIncomes = incomes.filter((income) => {
    // General search (source, notes, bank name, amount)
    const searchLower = search.trim().toLowerCase();
    let matchesSearch = true;
    if (searchLower) {
      matchesSearch =
        (income.source || "").toLowerCase().includes(searchLower) ||
        (income.notes || "").toLowerCase().includes(searchLower) ||
        (income.bank_account_name || "").toLowerCase().includes(searchLower) ||
        (income.amount + "").includes(searchLower);
    }
    // Date filter (YYYY-MM-DD)
    let matchesDate = true;
    if (filterDate) {
      matchesDate = income.date === filterDate;
    }
    // Source/category filter
    let matchesSource = true;
    if (filterSource) {
      matchesSource = income.source === filterSource;
    }
    // Bank filter (by id or name)
    let matchesBank = true;
    if (filterBank) {
      matchesBank =
        (income.bank_account_id &&
          income.bank_account_id.toString() === filterBank) ||
        (income.bank_account_name && income.bank_account_name === filterBank);
    }
    return matchesSearch && matchesDate && matchesSource && matchesBank;
  });

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

          {/* Search and Filters */}
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search source, notes, bank, amount"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 pl-10 text-gray-700"
              />
            </div>
            {/* Date Filter */}
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded border border-slate-300 p-2 text-gray-700 md:w-auto"
              placeholder="Date"
            />
            {/* Source/Category Filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="rounded border border-slate-300 p-2 text-gray-700 md:w-auto"
            >
              <option value="">All Sources</option>
              {/* Dynamically list unique sources */}
              {[...new Set(incomes.map((i) => i.source).filter(Boolean))].map(
                (src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ),
              )}
            </select>
            {/* Bank Filter */}
            <select
              value={filterBank}
              onChange={(e) => setFilterBank(e.target.value)}
              className="rounded border border-slate-300 p-2 text-gray-700 md:w-auto"
            >
              <option value="">All Banks</option>
              {bankOptions.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.alias || bank.bank_name}
                </option>
              ))}
            </select>
            {/* Reset Filters Button */}
            {(search || filterDate || filterSource || filterBank) && (
              <button
                type="button"
                className="rounded bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                onClick={() => {
                  setSearch("");
                  setFilterDate("");
                  setFilterSource("");
                  setFilterBank("");
                }}
              >
                Reset
              </button>
            )}
          </div>

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
                {filteredIncomes.length > 0 ? (
                  filteredIncomes.map((income) => (
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
