import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { API_URL } from "../config"; // Assuming API_URL is defined in the config file

export default function AddExpense() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState(""); // Changed to "description" as per your table structure

    const handleSave = async (e) => {
        e.preventDefault();

        // Retrieve userId from localStorage
        const userId = localStorage.getItem("userId");

        // Ensure userId exists
        if (!userId) {
            console.error("User ID not found, redirecting to login.");
            navigate("/login");
            return;
        }

        // Convert userId to an integer
        const userIdInt = parseInt(userId, 10);

        // Create the expense object to send to the backend
        const expenseData = {
            user_id: userIdInt, // Now user_id is an integer
            amount: parseFloat(amount), // Ensure the amount is a float
            category,
            date,
            description
        };

        console.log("Expense Data:", expenseData); // Log the data to verify it

        try {
            // Send POST request to your backend API
            const response = await fetch(`${API_URL}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenseData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Expense Saved:", result);
                alert("Expense saved successfully!"); // Pop-up alert
                // Reset form fields after successful save
                setAmount("");
                setCategory("");
                setDate("");
                setDescription("");
            } else {
                const errorText = await response.text();
                console.error("Failed to save expense:", errorText);
                alert("Failed to save expense: " + errorText);
            }
        } catch (error) {
            console.error("Error saving expense:", error);
            alert("Error saving expense");
        }
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
                            <label htmlFor="description" className="mb-1 font-medium text-gray-700">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border p-2 bg-gray-50 text-gray-700 rounded"
                                placeholder="Add any description here..."
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
