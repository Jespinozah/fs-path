import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Profile() {
  const [user, setUser] = useState({ id: "", name: "", email: "", age: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    // Log the user object to check if all required fields are populated
    console.log("User data before submitting:", user);
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${API_URL}/users/${user.id}`, { 
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          age: age,
          password: user.password,  // Optional, only include if changing the password
        }),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert("Profile updated successfully!");
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
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-green-700 text-white py-3 px-5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">My App</h2>
          <button
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-400"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="w-10 h-10 bg-white text-green-700 flex items-center justify-center rounded-full font-bold hover:bg-gray-200"
            onClick={() => navigate("/profile")}
          >
            U
          </button>
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-400"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </nav>
  
      <div className="w-3/4 md:w-1/2 bg-white p-6 rounded shadow-md mt-6">
        <h1 className="text-2xl font-semibold mb-4">Update Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="age" className="mb-1 font-medium">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={user.age}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}