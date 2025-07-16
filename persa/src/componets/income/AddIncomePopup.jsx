import React, { useState, useEffect } from "react";
import PopUpForm from "../shared/PopUpForm";

export default function AddIncomePopup({ onClose, onAddIncome }) {
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0],
    bankAccountId: "",
    notes: "",
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;
      // Remove /api/v1 from endpoint
      const res = await fetch(`/api/v1/bank-accounts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(Array.isArray(data) ? data : data.accounts || []);
      } else {
        console.error("Failed to fetch accounts", res.status);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (
      !formData.source ||
      !formData.amount ||
      !formData.date ||
      !formData.bankAccountId
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    const amount = parseFloat(formData.amount);
    const bankAccountId = parseInt(formData.bankAccountId, 10);
    if (isNaN(amount) || isNaN(bankAccountId)) {
      alert("Amount and Bank Account are required and must be valid.");
      return;
    }
    // Try both payloads if unsure which field backend expects
    const payload = {
      source: formData.source,
      amount: amount,
      date: formData.date,
      bank_account_id: bankAccountId,
      notes: formData.notes,
    };

    console.log("Submitting income payload:", payload);
    try {
      const res = await fetch(`/api/v1/incomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const responseText = await res.text();
      let newIncome = null;
      try {
        newIncome = JSON.parse(responseText);
      } catch {
        newIncome = responseText;
      }
      if (res.ok) {
        onAddIncome(newIncome.income || newIncome);
        onClose();
      } else {
        console.error(
          "Failed to add income:",
          res.status,
          responseText,
          "Payload:",
          payload,
        );
        alert(`Failed to add income. Server responded with: ${responseText}`);
      }
    } catch (e) {
      console.error("Error adding income:", e, "Payload:", payload);
      alert("Error adding income.");
    }
  };

const fields = [
  { name: "source", label: "Income Source", type: "text", required: true, placeholder: "e.g., Salary" },
  { name: "amount", label: "Amount", type: "number", required: true, placeholder: "Enter amount", min: 0 },
  { name: "date", label: "Date Received", type: "date", required: true },
  {
    name: "bankAccountId",
    label: "Bank Account",
    type: "select",
    required: true,
    options: accounts.map(acc => ({ value: acc.id, label: acc.bank_name })),
    placeholder: "Select Account"
  },
  { name: "notes", label: "Notes (optional)", type: "textarea", required: false, placeholder: "Add any notes..." }
];
  return (
    <PopUpForm
      fields={fields}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitLabel="Add Income"
      header ="Add Income"
    />
  );
}
