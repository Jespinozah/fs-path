import React, { useState } from "react";
import { API_URL } from "../config";

export default function ChangePasswordForm({ setSuccessMessage }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const errorText = await response.text();
        console.error("Failed to change password:", errorText);
        alert("Failed to change password: " + errorText);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
      <div className="flex flex-col">
        <label htmlFor="currentPassword" className="mb-1 font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 bg-gray-50 text-gray-700 rounded"
          placeholder="Enter current password"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="newPassword" className="mb-1 font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 bg-gray-50 text-gray-700 rounded"
          placeholder="Enter new password"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirmNewPassword" className="mb-1 font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="border p-2 bg-gray-50 text-gray-700 rounded"
          placeholder="Confirm new password"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
        >
          Change Password
        </button>
      </div>
    </form>
  );
}
