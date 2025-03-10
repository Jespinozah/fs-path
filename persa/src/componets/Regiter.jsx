import React, { useState } from "react";

export default function SignUp({ onSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSignUp(name, email, password);
  };

  return (
    <div className="relative w-full h-screen bg-blue-900/90">
      <div className="flex justify-center items-center h-full">
        <form
          className="max-w-[400px] w-full mx-auto bg-white p-12 rounded-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-bold text-center py-5">Sign Up</h2>
          <div className="flex flex-col py-2">
            <label>Name</label>
            <input
              className="border p-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col py-2">
            <label>Email</label>
            <input
              className="border p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col py-2">
            <label>Password</label>
            <input
              className="border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col py-2">
            <label>Confirm Password</label>
            <input
              className="border p-2"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="border w-full my-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            type="submit"
          >
            Sign Up
          </button>
          <div className="flex justify-center">
            <p>Already have an account?</p>
            <button type="button" className="text-blue-500">
              <a href="/login"> Log in</a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
