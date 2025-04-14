import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import NavigationBar from "./NavigationBar";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function Profile() {
  const [user, setUser] = useState({ id: "", name: "", email: "", age: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [activeTab, setActiveTab] = useState("viewProfile"); // State to toggle tabs
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
            Authorization: `Bearer ${token}`,
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar onLogout={handleLogout} />
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-3/4 md:w-1/2 bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
            Profile
          </h1>

          {/* Display success message */}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {/* Tabs for switching between views */}
          <div className="flex justify-center mb-4 space-x-4">
            <button
              className={`py-2 px-4 rounded ${
                activeTab === "viewProfile"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("viewProfile")}
            >
              Edit Profile
            </button>
            <button
              className={`py-2 px-4 rounded ${
                activeTab === "changePassword"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>
          </div>

          {/* Render content based on active tab */}
          {activeTab === "viewProfile" && (
            <EditProfileForm
              user={user}
              setUser={setUser}
              setSuccessMessage={setSuccessMessage}
            />
          )}
          {activeTab === "changePassword" && (
            <ChangePasswordForm setSuccessMessage={setSuccessMessage} />
          )}
        </div>
      </div>
    </div>
  );
}