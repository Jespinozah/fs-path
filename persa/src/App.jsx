import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./componets/auth/Login";
import Signup from "./componets/auth/Signup";
import Success from "./componets/Success";
import Failure from "./componets/auth/Failure";
import Profile from "./componets/profile/Profile";
import AddExpense from "./componets/expenses/AddExpensePopup"; // Import the AddExpense component
import Expenses from "./componets/expenses/Expenses"; // Import the Expenses component
import EditExpense from "./componets/expenses/EditExpense"; // Import the EditExpense component
import BankAccounts from "./componets/BankAccounts"; // Import the BankAccounts component
import Income from "./componets/income/Income"; // Import the Income page
import EditIncome from "./componets/income/EditIncome"; // Import the EditIncome component
import ViewBankAccount from "./componets/ViewBankAccount";

function App() {
  const handleLogin = async (email, password, navigate) => {
    try {
      const response = await fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // Store token and user ID in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userId", data.user_id); // Save userId
        // Redirect to the success page
        navigate("/success");
      } else {
        console.error("Login failed:", data.error);
        navigate("/failure"); // Redirect on failure
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/failure");
    }
  };

  const handleSignUp = async (name, email, age, password, navigate) => {
    try {
      const response = await fetch(`/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, age: parseInt(age, 10), password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Sign up successful:", data);
        // Redirect to the success page
        navigate("/login", {
          state: { message: "Signup successful! Please log in." },
        });
      } else {
        console.error("Sign up failed:", data.error);
        navigate("/failure");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/failure");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignUp={handleSignUp} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/:expenseId" element={<EditExpense />} />
        <Route path="/bank-accounts" element={<BankAccounts />} />
        <Route path="/income" element={<Income />} />
        <Route path="/income/:incomeId" element={<EditIncome />} />
        <Route path="/bank-accounts/:id/view" element={<ViewBankAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
