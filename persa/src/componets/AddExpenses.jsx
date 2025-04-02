import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

export default function AddExpense() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Expense Saved:", { amount, category, date, notes });
        // Add logic to save the expense
    };

    return (
        <div className="h-screen bg-gray-100">
            <NavigationBar onLogout={() => navigate("/login")} />
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Add Expense</h1>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="amount" className="mb-1 font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border p-2 bg-gray-50 text-gray-700 rounded"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="category" className="mb-1 font-medium text-gray-700">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border p-2 bg-gray-50 text-gray-700 rounded"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Food">🍔 Food</option>
                                <option value="Travel">✈️ Travel</option>
                                <option value="Bills">💡 Bills</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="date" className="mb-1 font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border p-2 bg-gray-50 text-gray-700 rounded"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="notes" className="mb-1 font-medium text-gray-700">Notes (Optional)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 bg-gray-50 text-gray-700 rounded"
                                placeholder="Add any notes here..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                            >
                                Save Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
