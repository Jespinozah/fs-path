import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import NavigationBar from "../NavigationBar";
import AddExpensePopup from "./AddExpensePopup";
import { get, post, del } from "../../utils/Api"; // Import the get function from utils/api

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [showAddExpensePopup, setShowAddExpensePopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(""); // State for delete success message
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup
  const [expenseToDelete, setExpenseToDelete] = useState(null); // State for expense to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await get(`/expenses?page=${currentPage}&per_page=10`);
        setExpenses(
          data.expenses.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        setTotalPages(Math.ceil(data.total / data.per_page));
      } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to fetch expenses");
      }
    };

    fetchExpenses();
  }, [currentPage]);

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
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      if (!userId) {
        console.error("User ID not found, redirecting to login.");
        navigate("/login");
        return;
      }

      const expenseData = {
        user_id: parseInt(userId, 10),
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        description: newExpense.description,
      };

      const result = await post("/expenses", expenseData);
      setExpenses([
        {
          ...newExpense,
          id: result.id,
          amount: parseFloat(newExpense.amount),
        },
        ...expenses,
      ]);
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
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            All Expenses
          </h2>

          {/* Display success messages */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}
          {deleteSuccessMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {deleteSuccessMessage}
            </div>
          )}

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={expense.id || index}>
                  <td className="border border-gray-300 px-4 py-2">{expense.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="flex items-center">
                      <span className="text-xl mr-2">{expense.icon}</span>
                      {expense.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">${expense.amount.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{expense.description || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(expense.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(expense.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500"}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500"}`}
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
        className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
        title="Add Expense"
      >
        +
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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6">Do you really want to delete this expense? This action cannot be undone.</p>
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
