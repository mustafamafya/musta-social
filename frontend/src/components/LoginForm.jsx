import React, { useState } from 'react';
import { loginUser } from '../services/auth.js';
import { Link } from 'react-router-dom';
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await loginUser({ username, password });
      const accessToken = response.data?.tokens?.access;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        window.location.href = '/dashboard'; // or use navigate('/dashboard') if using React Router
      } else {
        setError('No access token received');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-black">
        <h1 className="text-3xl font-bold text-blue-600 mb-2 animate-pulse">Musta Social</h1>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          className="mb-2 p-3 rounded-lg border border-gray-400 focus:border-blue-500 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-3 rounded-lg border border-gray-400 focus:border-blue-500 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md w-full">
          Login
        </button>
       {/* to navigate between login and registeration page */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create one here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;