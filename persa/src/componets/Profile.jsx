import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";

export default function Profile() {
  const [user, setUser] = useState({ id: "", name: "", email: "", age: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("User ID not found, redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const age = parseInt(user.age, 10);

    if (newPassword && newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          age: age,
          current_password: currentPassword, // Verify current password
          password: newPassword || undefined, // Only include if changing password
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert("Profile updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        alert("Failed to update profile: " + errorText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="h-screen bg-gray-100">
      <NavigationBar onLogout={handleLogout} />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Update Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="age" className="mb-1 font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={user.age}
                onChange={handleChange}
                className="border p-2 bg-gray-50 text-gray-700 rounded"
              />
            </div>

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

            <div className="flex justify-between">
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400"
                onClick={() => navigate("/success")} // Redirect to Success page
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}