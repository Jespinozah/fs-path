import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Button from "./shared/Button";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'

// Helper to get icon for a category
const getCategoryIcon = (category) => {
  const icons = {
    Food: "🍔",
    Travel: "✈️",
    Bills: "💡",
    // Add more categories as needed
  };
  return icons[category] || "💸";
};

export default function ViewBankAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        // Fetch account details
        const accRes = await fetch(`/api/v1/bank-accounts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (accRes.ok) {
          setAccount(await accRes.json());
        }
        // Fetch transactions (expenses)
        const expRes = await fetch(`/api/v1/expenses?bank_account_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (expRes.ok) {
          const data = await expRes.json();
          setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
        }
        // Fetch incomes
        const incRes = await fetch(`/api/v1/incomes?bank_account_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (incRes.ok) {
          const data = await incRes.json();
          setIncomes(Array.isArray(data.incomes) ? data.incomes : []);
        }
      } catch (error) {
        console.error("Error fetching bank account details:", error);
      }
      setLoading(false);
    };
    fetchAll();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex flex-col items-center p-6">
        <div className="w-full rounded-lg bg-white p-6 shadow-md md:w-2/3">
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate("/bank-accounts")}
            icon={<ArrowUturnLeftIcon className="size-4" />}
            iconPosition="left"
          >
          </Button>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Bank Account Details
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : account ? (
            <>
              <div className="mb-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-200 p-6 shadow flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center mr-6">
                    <div className="rounded-full bg-blue-500 text-white w-14 h-14 flex items-center justify-center text-2xl shadow">
                      <span role="img" aria-label="bank">🏦</span>
                    </div>
                    <div className="mt-2 text-sm text-blue-700 font-semibold">{account.bank_name}</div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Alias:</span>
                      <span className="text-gray-900">{account.alias || "--"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Account Number:</span>
                      <span className="tracking-widest text-gray-900">
                        {"*".repeat(account.account_number.length - 4) + account.account_number.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Routing Number:</span>
                      <span className="text-gray-900">{account.routing_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Account Type:</span>
                      <span className="text-gray-900">{account.account_type}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <span className="font-semibold text-gray-700 mr-2">Balance:</span>
                      <span className="text-green-700 font-bold text-lg">
                        {account.balance !== undefined
                          ? `$${Number(account.balance).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : "--"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Income</h3>
                {incomes.length > 0 ? (
                  <table className="w-full mb-4 table-auto text-left">
                    <thead>
                      <tr>
                        <th className="px-2 py-1">Source</th>
                        <th className="px-2 py-1">Amount</th>
                        <th className="px-2 py-1">Date</th>
                        <th className="px-2 py-1">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomes.map((inc) => (
                        <tr key={inc.id}>
                          <td className="px-2 py-1">{inc.source}</td>
                          <td className="px-2 py-1 text-green-700 font-semibold">
                            +${parseFloat(inc.amount).toFixed(2)}
                          </td>
                          <td className="px-2 py-1">{inc.date}</td>
                          <td className="px-2 py-1">{inc.notes || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-sm mb-2">No income records.</div>
                )}
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Expenses</h3>
                {expenses.length > 0 ? (
                  <div className="relative flex h-full w-full flex-col rounded-lg bg-white bg-clip-border text-gray-700 shadow-md">
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
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((exp) => (
                          <tr key={exp.id} className="hover:bg-slate-50">
                            <td className="border-b border-slate-200 p-4">
                              <p className="block text-sm text-slate-800">{exp.date}</p>
                            </td>
                            <td className="border-b border-slate-200 p-4">
                              <p className="flex items-center text-sm text-slate-800">
                                <span className="mr-2 text-xl">
                                  {getCategoryIcon(exp.category)}
                                </span>
                                {exp.category}
                              </p>
                            </td>
                            <td className="border-b border-slate-200 p-4">
                              <p className="block text-sm text-red-700 font-semibold">
                                -${parseFloat(exp.amount).toFixed(2)}
                              </p>
                            </td>
                            <td className="border-b border-slate-200 p-4">
                              <p className="block text-sm text-slate-800">{exp.description || ""}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mb-2">No expense records.</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-red-600">Bank account not found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
