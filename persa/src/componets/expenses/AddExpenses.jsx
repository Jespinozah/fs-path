import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { post } from "../../utils/Api"; // Import the post function

export default function AddExpense() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(
        new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
    ); // Adjust for local timezone
    const [description, setDescription] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found, redirecting to login.");
            navigate("/login");
            return;
        }

        const expenseData = {
            user_id: parseInt(userId, 10),
            amount: parseFloat(amount),
            category,
            date,
            description,
        };

        try {
            await post("/expenses", expenseData); // Use the post function
            setAmount("");
            setCategory("");
            setDate("");
            setDescription("");
            setSuccessMessage("Expense added successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error saving expense:", error);
            alert("Error saving expense");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavigationBar onLogout={() => navigate("/login")} />
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Add Expense</h1>

                    {/* Display success message */}
                    {successMessage && (
                        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="amount" className="mb-1 font-medium text-gray-700">Amount</label>
                            <input
                                type="text" // Change to text to prevent scroll behavior
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border p-2 bg-gray-50 text-gray-700 rounded"
                                placeholder="Enter amount"
                                inputMode="decimal" // Allow only numeric input
                                pattern="[0-9]*" // Ensure only numbers are entered
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
                            <label htmlFor="description" className="mb-1 font-medium text-gray-700">Description</label>
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
