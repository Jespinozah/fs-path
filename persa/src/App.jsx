import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./componets/login";
import Signup from "./componets/Signup";
import Success from "./componets/Success";
import Failure from "./componets/failure";

function App() {


  const handleLogin = async (email, password, navigate) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        navigate("/success"); // Redirect on success
      } else {
        console.error("Login failed:", data.error);
        navigate("/failure"); // Redirect on failure
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/failure");
    }
  };

  const handleSignUp = (name, email, password, navigate) => {
    if (email && password.length >= 6) {
      navigate("/success");
    } else {
      navigate("/failure");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/signup"
          element={<Signup onSignUp={handleSignUp} />}
        />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
      </Routes>
    </Router>
  );
}

export default App;
