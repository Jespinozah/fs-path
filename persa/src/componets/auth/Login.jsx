import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); // Access the location state
  const message = location.state?.message; // Get the message if available

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(email)) tempErrors.email = "Invalid email format";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6)
      tempErrors.password = "Password must be at least 6 characters long";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onLogin(email, password, navigate);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <div className="flex justify-center items-center h-full">
        <form
          className="max-w-[400px] w-full mx-auto bg-white p-12 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-bold text-center text-blue-600 py-5">Log in</h2>

          {/* Display success message box if the message exists */}
          {message && (
            <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg text-center">
              {message}
            </div>
          )}

          <div className="flex justify-between py-4">
            <button className="border border-gray-300 shadow-sm hover:shadow-md px-6 py-2 flex items-center gap-2 rounded-lg w-full mr-2 bg-white text-gray-700">
              <FaFacebookSquare /> Facebook
            </button>
            <button className="border border-gray-300 shadow-sm hover:shadow-md px-6 py-2 flex items-center gap-2 rounded-lg w-full ml-2 bg-white text-gray-700">
              <FcGoogle /> Google
            </button>
          </div>
          <div className="flex flex-col py-2">
            <label className="text-gray-700">Email</label>
            <input
              className="border p-2 bg-gray-50 text-gray-700 rounded"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col py-2">
            <label className="text-gray-700">Password</label>
            <input
              className="border p-2 bg-gray-50 text-gray-700 rounded"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            className={`border w-full my-5 py-2 text-white rounded ${Object.keys(errors).length === 0
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-400 cursor-not-allowed"
              }`}
            type="submit"
            disabled={Object.keys(errors).length > 0}
          >
            Sign In
          </button>
          <div className="flex justify-between">
            <p className="flex items-center mr-2 text-gray-700">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
            <button type="button" className="text-blue-600 hover:underline">
              <a href="/signup">Create an account</a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
