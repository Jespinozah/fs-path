import React, { useState } from "react";
import PopUpForm from "./shared/PopUpForm";

export default function AddBankAccountPopup({ onClose, onAddAccount }) {
  const [formData, setFormData] = useState({
    bank: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
    alias: "",
    balance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Add validation if needed
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    const payload = {
      user_id: parseInt(userId, 10),
      bank_name: formData.bank,
      routing_number: formData.routingNumber,
      account_number: formData.accountNumber,
      account_type: formData.accountType,
      alias: formData.alias,
      balance: parseFloat(formData.balance) || 0,
    };

    try {
      const response = await fetch(`/api/v1/bank-accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newAccount = await response.json();
        onAddAccount(newAccount);
        onClose();
      } else {
        alert("Failed to add account.");
      }
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Error adding account.");
    }
  };

  const fields = [
    {
      name: "bank",
      label: "Bank Name",
      type: "text",
      required: true,
      placeholder: "Enter bank name",
    },
    {
      name: "routingNumber",
      label: "Routing Number",
      type: "text",
      required: true,
      placeholder: "9 digits",
      minLength: 9,
      maxLength: 9,
    },
    {
      name: "accountNumber",
      label: "Account Number",
      type: "text",
      required: true,
      placeholder: "8-17 digits",
      minLength: 8,
      maxLength: 17,
    },
    {
      name: "accountType",
      label: "Account Type",
      type: "select",
      required: true,
      options: [
        { value: "checking", label: "Checking" },
        { value: "savings", label: "Savings" },
      ],
    },
    {
      name: "alias",
      label: "Alias (Optional)",
      type: "text",
      required: false,
      placeholder: "Enter alias",
    },
    {
      name: "balance",
      label: "Balance",
      type: "number",
      required: true,
      placeholder: "Enter initial balance",
      min: 0,
    },
  ];

  return (
    <PopUpForm
      fields={fields}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitLabel="Add Account"
      header="Add New Bank Account"
    />
  );
}
