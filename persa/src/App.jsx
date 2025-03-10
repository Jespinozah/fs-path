import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./componets/login";
import Signup from "./componets/Signup";

function App() {
  const handleLogin = (email, password) => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleSignUp = (name, email, password) => {
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/signup"
          element={<Signup onSignUp={handleSignUp} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
