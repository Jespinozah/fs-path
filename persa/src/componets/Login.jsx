import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(email)) tempErrors.email = "Invalid email format";

    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters long";

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
    <div className="relative w-full h-screen bg-blue-900/90">
      <div className="flex justify-center items-center h-full">
        <form className="max-w-[400px] w-full mx-auto bg-white p-12 rounded-lg" onSubmit={handleSubmit}>
          <h2 className="text-4xl font-bold text-center py-5">Log in</h2>
          <div className="flex justify-between py-4">
            <button className="border border-gray-300 shadow-lg hover:shadow-xl px-6 py-2 flex items-center gap-2 rounded-lg w-full mr-2">
              <FaFacebookSquare /> Facebook
            </button>
            <button className="border border-gray-300 shadow-lg hover:shadow-xl px-6 py-2 flex items-center gap-2 rounded-lg w-full ml-2">
              <FcGoogle /> Google
            </button>
          </div>
          <div className="flex flex-col py-2">
            <label>Email</label>
            <input
              className="border p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="flex flex-col py-2">
            <label>Password</label>
            <input
              className="border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <button
            className={`border w-full my-5 py-2 text-white rounded ${Object.keys(errors).length === 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-400 cursor-not-allowed"}`}
            type="submit"
            disabled={Object.keys(errors).length > 0}
          >
            Sign In
          </button>
          <div className="flex justify-between">
            <p className="flex items-center mr-2">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
            <button type="button" className="text-blue-500">
              <a href="/signup">Create an account</a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}