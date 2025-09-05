// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound'; // fallback route


function App() {
  
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Optional Default Route */}
        <Route path="/" element={<Dashboard />} />

        {/* Fallback for unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;