import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import PopUpForm from "../shared/PopUpForm";

export default function AddExpensePopup({ onClose, onAddExpense }) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0],
    time: new Date().toTimeString().split(" ")[0],
    description: "",
    bank_account_id: "",
  });

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch bank accounts
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;
      const res = await fetch(`${API_URL}/bank-accounts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(Array.isArray(data) ? data : data.accounts || []);
      } else {
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddExpense = () => {
    if (
      newExpense.amount &&
      newExpense.category &&
      newExpense.date &&
      newExpense.time &&
      newExpense.bank_account_id
    ) {
      onAddExpense(newExpense);
      setNewExpense({
        amount: "",
        category: "",
        date: "",
        time: "",
        description: "",
        bank_account_id: "",
      });
      onClose();
    } else {
      alert(
        "Please fill out all required fields, including time and bank account.",
      );
    }
  };

  const fields = [
    { name: "amount", label: "Amount", type: "number", required: true, placeholder: "Enter amount", min: 0 },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { value: "Food", label: "🍔 Food" },
        { value: "Travel", label: "✈️ Travel" },
        { value: "Bills", label: "💡 Bills" },
      ],
      placeholder: "Select Category",
    },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "time", label: "Time", type: "time", required: true },
    { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Add any description here..." },
    {
      name: "bank_account_id",
      label: "Bank Account",
      type: "select",
      required: true,
      options: accounts.map(acc => ({
        value: acc.id,
        label: acc.bank_name || `Account #${acc.id}`,
      })),
      placeholder: "Select Bank Account",
    },
  ];

  return (
    <PopUpForm
      fields={fields}
      formData={newExpense}
      onChange={handleChange}
      onSubmit={handleAddExpense}
      onCancel={onClose}
      submitLabel="Add"
      header="Add Expense"
    />
  );
}
