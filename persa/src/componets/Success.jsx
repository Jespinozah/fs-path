import "chart.js/auto";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom"; // Import useLocation
import NavigationBar from "./NavigationBar";
import Button from "./shared/Button";

export default function Success() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State for selected transaction
  const [bankAccounts, setBankAccounts] = useState([]);
  const [incomeRecords, setIncomeRecords] = useState([]); // Add state for income
  const [totalBankBalance, setTotalBankBalance] = useState(0); // Add state for total bank balance

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(`/api/v1/expenses?page=1&per_page=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched expenses data:", data); // Log the response data

          if (Array.isArray(data.expenses)) {
            // Access the 'expenses' key
            setTransactions(
              data.expenses
                .map((expense) => ({
                  id: expense.id,
                  category: expense.category,
                  amount: expense.amount,
                  date: expense.date, // Add date field
                  icon: getCategoryIcon(expense.category), // Map category to an icon
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date)), // Sort by date (descending)
            );
          } else {
            console.error("Unexpected data format:", data);
            alert("Failed to fetch expenses: Unexpected data format.");
          }
        } else {
          console.error("Failed to fetch expenses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [navigate]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("User ID or token not found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `/api/v1/bank-accounts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const accounts = data.accounts || data;
          setBankAccounts(accounts); // Adjust based on API response structure
          // Calculate total bank balance
          const total = Array.isArray(accounts)
            ? accounts.reduce(
                (sum, acc) => sum + (parseFloat(acc.balance) || 0),
                0,
              )
            : 0;
          setTotalBankBalance(total);
        } else {
          console.error("Failed to fetch bank accounts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };

    fetchBankAccounts();
  }, [navigate]);

  useEffect(() => {
    // Fetch recent income records
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) return;
        const response = await fetch(
          `/api/v1/bank-accounts/users/${userId}/incomes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setIncomeRecords(Array.isArray(data) ? data : data.incomes || []);
        }
      } catch (error) {
        console.error("Error fetching income records:", error);
        // Optionally handle error
      }
    };
    fetchIncome();
  }, [navigate]);

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍔",
      Travel: "✈️",
      Bills: "💡",
    };
    return icons[category] || "💸"; // Default icon
  };

  useEffect(() => {
    const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);
    setBalance(-totalExpenses);
  }, [transactions]);

  // Pie chart data
  const chartData = {
    labels: [...new Set(transactions.map((t) => t.category))], // Unique categories
    datasets: [
      {
        data: [...new Set(transactions.map((t) => t.category))].map(
          (category) =>
            transactions
              .filter((t) => t.category === category)
              .reduce((sum, t) => sum + t.amount, 0), // Sum amounts for each category
        ),
        backgroundColor: [...new Set(transactions.map((t) => t.category))].map(
          (_, index) => `hsl(${(index * 60) % 360}, 70%, 70%)`, // Generate dynamic colors
        ),
      },
    ],
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await fetch(`/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleTransactionClick = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      const response = await fetch(`/api/v1/expenses/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json(); // Some APIs return { expense: {...} }, others just {...}
        setSelectedTransaction(data.expense || data); // Set the full transaction details, including description
      } else {
        console.error(
          "Failed to fetch transaction details:",
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={handleLogout} />

      {/* Show selected transaction details as a modal/card */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.6)" }}
        >
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedTransaction(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Transaction Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Date:</span>{" "}
                {selectedTransaction.date}
              </div>
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {selectedTransaction.category}
              </div>
              <div>
                <span className="font-semibold">Amount:</span> $
                {parseFloat(selectedTransaction.amount).toFixed(2)}
              </div>
              {selectedTransaction.description && (
                <div>
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedTransaction.description}
                </div>
              )}
              {/* Add bank name if available */}
              {(selectedTransaction.bank_account_name ||
                selectedTransaction.bank_name) && (
                <div>
                  <span className="font-semibold">Bank Account:</span>{" "}
                  {selectedTransaction.bank_account_name ||
                    selectedTransaction.bank_name}
                </div>
              )}
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-wrap px-4 py-6">
        {/* Left Side: Dashboard Content */}
        <div className="flex w-full flex-col items-center md:w-1/2">
          {/* Expenses Dashboard */}
          <div
            id="expenses"
            className="w-11/12 space-y-6 rounded-lg bg-white p-6 text-center shadow-md"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Expenses Dashboard
            </h2>

            {/* Total Balance */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Balance
              </h3>
              <p className="text-3xl font-bold text-green-600">
                ${balance.toFixed(2)}
              </p>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Recent Transactions
              </h3>
              <ul className="mt-2 space-y-2">
                {transactions.slice(0, 8).map((t) => (
                  <li
                    key={t.id}
                    className="flex cursor-pointer items-center justify-between border-b py-2"
                    onClick={() => handleTransactionClick(t.id)}
                  >
                    <span className="text-sm text-gray-500">{t.date}</span>
                    <span className="flex items-center">
                      <span className="text-xl">{t.icon}</span>
                      <span className="ml-2 text-gray-700">{t.category}</span>
                    </span>
                    <span className="font-medium text-red-500">
                      - ${t.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/expenses")}
                variant="primary"
                fullWidth={true}
                >
                See More    
              </Button>    
            </div>

            {/* Pie Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Spending by Category
              </h3>
              <div className="flex justify-center">
                <div style={{ width: "300px", height: "300px" }}>
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Bank Accounts and Income */}
        <div className="flex w-full flex-col items-center md:w-1/2">
          {/* Bank Accounts Card */}
          <div
            id="banck-accounts"
            className="w-11/12 space-y-6 rounded-lg bg-white p-6 text-center shadow-md"
          >
            <h2 className="text-2xl font-bold text-gray-800">Bank Accounts</h2>
            {/* Total Bank Balance */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Bank Balance
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                $
                {totalBankBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.length > 0 ? (
                  bankAccounts.map((account) => (
                    <tr key={account.account_number}>
                      <td className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-neutral-500">
                        {account.alias || account.bank_name}{" "}
                        {/* Display alias or bank name */}
                      </td>
                      <td className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-neutral-500">
                        $
                        {account.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {/* Format balance */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800 dark:text-neutral-200"
                    >
                      No accounts available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
              <Button
                onClick={() => navigate("/bank-accounts")}
                variant="primary"
                fullWidth={true}
                >
                See More    
              </Button>    
          </div>

          {/* Income Card */}
          <div
            id="income"
            className="mt-6 w-11/12 space-y-6 rounded-lg bg-white p-6 text-center shadow-md"
          >
            <h2 className="text-2xl font-bold text-gray-800">Income</h2>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Account
                  </th>
                </tr>
              </thead>
              <tbody>
                {incomeRecords.length > 0 ? (
                  incomeRecords
                    .slice(-5)
                    .reverse()
                    .map((income) => (
                      <tr key={income.id}>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {income.source}
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-green-600">
                          +${parseFloat(income.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {income.date}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {income.bank_account_name || ""}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No income records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
              <Button
                onClick={() => navigate("/income")}
                variant="primary"
                fullWidth={true}
                >
                See More    
              </Button>    
          </div>
        </div>
      </div>
    </div>
  );
}
