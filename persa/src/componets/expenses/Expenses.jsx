import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { del, get, post } from "../../utils/Api"; // Import the get function from utils/api
import NavigationBar from "../NavigationBar";
import AddExpensePopup from "./AddExpensePopup";
import sortExpenses from "../../utils/Date";
import { API_URL } from "../../config";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [showAddExpensePopup, setShowAddExpensePopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(""); // State for delete success message
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup
  const [expenseToDelete, setExpenseToDelete] = useState(null); // State for expense to delete
  const [search, setSearch] = useState(""); // General search bar
  const [filterDateFrom, setFilterDateFrom] = useState(""); // Date from
  const [filterDateTo, setFilterDateTo] = useState(""); // Date to
  const [filterCategory, setFilterCategory] = useState(""); // Category filter
  const [filterBank, setFilterBank] = useState(""); // Bank filter
  const [bankOptions, setBankOptions] = useState([]); // For bank dropdown
  const [filtersApplied, setFiltersApplied] = useState(false); // Track if search was clicked
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await get(`/expenses?page=${currentPage}&per_page=10`);
        // Map backend 'hour' to 'time' for consistent sorting
        const expensesWithTime = data.expenses.map((exp) => ({
          ...exp,
          time: exp.hour || "00:00:00",
        }));
        // Sort by date (desc), then by time (desc)
        expensesWithTime.sort((a, b) => {
          const dateA = a.date + "T" + (a.time || "00:00:00");
          const dateB = b.date + "T" + (b.time || "00:00:00");
          return dateB.localeCompare(dateA); // Newest first
        });
        setExpenses(expensesWithTime);
        setTotalPages(Math.ceil(data.total / data.per_page));
      } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to fetch expenses");
      }
    };

    fetchExpenses();
  }, [currentPage]);

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

  // Store filter values to apply on search
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    filterDateFrom: "",
    filterDateTo: "",
    filterCategory: "",
    filterBank: "",
  });

  // Filtered expenses based on all filters (use appliedFilters, not live state)
  const filteredExpenses = expenses.filter((expense) => {
    const {
      search: appliedSearch,
      filterDateFrom: appliedDateFrom,
      filterDateTo: appliedDateTo,
      filterCategory: appliedCategory,
      filterBank: appliedBank,
    } = appliedFilters;

    // General search (description, category, bank name, amount)
    const searchLower = appliedSearch.trim().toLowerCase();
    let matchesSearch = true;
    if (searchLower) {
      matchesSearch =
        (expense.description || "").toLowerCase().includes(searchLower) ||
        (expense.category || "").toLowerCase().includes(searchLower) ||
        (expense.bank_account_name || "").toLowerCase().includes(searchLower) ||
        (expense.amount + "").includes(searchLower);
    }
    // Date range filter
    let matchesDate = true;
    if (appliedDateFrom && appliedDateTo) {
      matchesDate =
        expense.date >= appliedDateFrom && expense.date <= appliedDateTo;
    } else if (appliedDateFrom) {
      matchesDate = expense.date >= appliedDateFrom;
    } else if (appliedDateTo) {
      matchesDate = expense.date <= appliedDateTo;
    }
    // Category filter
    let matchesCategory = true;
    if (appliedCategory) {
      matchesCategory = expense.category === appliedCategory;
    }
    // Bank filter (by id or name)
    let matchesBank = true;
    if (appliedBank) {
      matchesBank =
        (expense.bank_account_id &&
          expense.bank_account_id.toString() === appliedBank) ||
        (expense.bank_account_name &&
          expense.bank_account_name === appliedBank);
    }
    return matchesSearch && matchesDate && matchesCategory && matchesBank;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍔",
      Travel: "✈️",
      Bills: "💡",
    };
    return icons[category] || "💸";
  };

  const handleAddExpense = async (newExpense) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found, redirecting to login.");
        navigate("/login");
        return;
      }

      // Ensure time is in HH:MM:SS format
      let formattedTime = newExpense.time;
      if (formattedTime && formattedTime.length === 5) {
        formattedTime += ":00";
      }

      const expenseData = {
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        hour: formattedTime, // Include time field as 'hour'
        description: newExpense.description,
        bank_account_id: newExpense.bank_account_id, // Pass bank account
      };

      const result = await post("/expenses", expenseData);

      // Find the bank account name from bankOptions
      const bank = bankOptions.find(
        (b) =>
          b.id === newExpense.bank_account_id ||
          b.id === Number(newExpense.bank_account_id),
      );
      const bank_account_name = bank ? bank.alias || bank.bank_name : undefined;

      // Add the new expense and sort from newest to oldest
      const updatedExpenses = [
        {
          ...newExpense,
          id: result.id,
          amount: parseFloat(newExpense.amount),
          icon: getCategoryIcon(newExpense.category),
          date: newExpense.date,
          time: formattedTime,
          bank_account_name, // Add the bank account name for immediate display
        },
        ...expenses,
      ].sort(() => sortExpenses);
      setExpenses(updatedExpenses);
      setShowAddExpensePopup(false);
      setSuccessMessage("Expense added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error adding expense");
    }
  };

  const handleEdit = (expenseId) => {
    navigate(`/expenses/${expenseId}`);
  };

  const confirmDelete = (expenseId) => {
    setExpenseToDelete(expenseId);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await del(`/expenses/${expenseToDelete}`);
      setExpenses(expenses.filter((expense) => expense.id !== expenseToDelete));
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
      setDeleteSuccessMessage("Expense deleted successfully!");
      setTimeout(() => setDeleteSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Error deleting expense");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={() => navigate("/login")} />
      <div className="flex flex-col items-center p-6">
        <div className="w-full rounded-lg bg-white p-6 shadow-md md:w-3/4">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            All Expenses
          </h2>

          {/* Search and Filters */}
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search description, category, bank, amount"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 pl-10 text-gray-700"
              />
            </div>
            {/* Date Range Filter */}
            <span className="mx-1 text-gray-500">From</span>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="rounded border border-slate-300 p-2 text-gray-700 md:w-auto"
              placeholder="From"
            />
            <span className="mx-1 text-gray-500">to</span>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="rounded border border-slate-300 p-2 text-gray-700 md:w-auto"
              placeholder="To"
            />
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded border border-slate-300 p-2 text-gray-700 md:w-auto"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              {/* Add more categories as needed */}
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
            {/* Search Button */}
            <button
              type="button"
              className="rounded bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600"
              onClick={() => {
                setAppliedFilters({
                  search,
                  filterDateFrom,
                  filterDateTo,
                  filterCategory,
                  filterBank,
                });
                setFiltersApplied(true);
              }}
            >
              Search
            </button>
            {/* Clear Button */}
            {filtersApplied && (
              <button
                type="button"
                className="rounded bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                onClick={() => {
                  setSearch("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setFilterCategory("");
                  setFilterBank("");
                  setAppliedFilters({
                    search: "",
                    filterDateFrom: "",
                    filterDateTo: "",
                    filterCategory: "",
                    filterBank: "",
                  });
                  setFiltersApplied(false);
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Display success messages */}
          {successMessage && (
            <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-green-700">
              {successMessage}
            </div>
          )}
          {deleteSuccessMessage && (
            <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-green-700">
              {deleteSuccessMessage}
            </div>
          )}

          <div className="relative flex h-full w-full flex-col overflow-scroll rounded-lg bg-white bg-clip-border text-gray-700 shadow-md">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Date
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Category
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Amount
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Description
                    </p>
                  </th>
                  <th className="border-b border-slate-300 bg-slate-50 p-4">
                    <p className="block text-sm leading-none font-normal text-slate-500">
                      Bank Account
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
                {filteredExpenses.map((expense, index) => (
                  <tr key={expense.id || index} className="hover:bg-slate-50">
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {expense.date}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="flex items-center text-sm text-slate-800">
                        <span className="mr-2 text-xl">
                          {getCategoryIcon(expense.category)}
                        </span>
                        {expense.category}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        ${expense.amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {expense.description || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <p className="block text-sm text-slate-800">
                        {/* Show bank account name if available, else ID, else N/A */}
                        {expense.bank_account_name || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-slate-200 p-4">
                      <button
                        onClick={() => handleEdit(expense.id)}
                        className="mr-2 rounded bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(expense.id)}
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

          {/* Pagination Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`rounded px-4 py-2 ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`rounded px-4 py-2 ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Floating Add Expense Button */}
      <button
        onClick={() => setShowAddExpensePopup(true)}
        className="fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-3xl text-white shadow-lg hover:bg-indigo-600"
        title="Add Bank Account"
      >
        <FaPlus />
      </button>

      {/* Add Expense Popup */}
      {showAddExpensePopup && (
        <AddExpensePopup
          onClose={() => setShowAddExpensePopup(false)}
          onAddExpense={handleAddExpense}
        />
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Are you sure?</h3>
            <p className="mb-6">
              Do you really want to delete this expense? This action cannot be
              undone.
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
