import React from "react";
import { useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onLogin(email, password);
  };

  return (
    <div className="relative w-full h-screen bg-blue-900/90">
      <div className="flex justify-center items-center h-full ">
        <form className="max-w-[400px] w-full mx-auto bg-white p-12 rounded-lg">
          <h2 className="text-4xl font-bold text-center py-5">Log in</h2>
          <div className="flex justify-between py-4">
            <p className="border border-gray-300 shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center gap-2 rounded-lg">
              <FaFacebookSquare /> Facebook
            </p>
            <p className="border border-gray-300 shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center gap-2 rounded-lg">
              <FcGoogle /> Google
            </p>
          </div>
          <div className="flex flex-col py-2 ">
            <label>Email</label>
            <input
              className="border p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col py-2">
            <label>Password</label>
            <input
              className="border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={handleSubmit}
          >
            Sing In
          </button>
          <div className="flex justify-between">
            <p className="flex items-center mr-2">
              <input className="mr-2" type="checkbox" />
              Remember Me
            </p>
            <button type="button" className="text-blue-500">
              <a href="/register">Create an account</a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
