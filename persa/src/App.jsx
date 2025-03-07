import './App.css'
import Login from './componets/login'

function App() {
  const handleLogin = (email, password) => {
    console.log('Email:', email);
    console.log('Password:', password);
  };
  return (
    <div>
      <Login onLogin={handleLogin}/>
    </div>
  );
}

export default App;
