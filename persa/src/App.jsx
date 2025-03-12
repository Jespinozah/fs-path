import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./componets/login";
import Signup from "./componets/Signup";
import Success from "./componets/Success";
import Failure from "./componets/failure";

function App() {
  const handleLogin = (email, password, navigate) => {
    if (email === "test@example.com" && password === "password123") {
      navigate("/success");
    } else {
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
