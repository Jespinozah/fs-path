import React, { useState } from "react";
import { put } from "../../utils/Api"; // Import the put function

export default function EditProfileForm({ user, setUser, setSuccessMessage, onCancel }) {
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await put(`/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10),
      }); // Use the put function
      setUser(updatedUser);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false); // Disable editing mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 bg-gray-50 text-gray-700 rounded"
          disabled={!isEditing} // Disable input if not editing
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 bg-gray-50 text-gray-700 rounded"
          disabled={!isEditing} // Disable input if not editing
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="age" className="mb-1 font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="border p-2 bg-gray-50 text-gray-700 rounded"
          disabled={!isEditing} // Disable input if not editing
        />
      </div>

      <div className="flex justify-between">
        {isEditing ? (
          <>
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400"
              onClick={() => {
                setFormData(user); // Reset form data
                setIsEditing(false); // Disable editing mode
                onCancel(); // Call onCancel to return to profile view
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            onClick={() => setIsEditing(true)} // Enable editing mode
          >
            Edit
          </button>
        )}
      </div>
    </form>
  );
}
