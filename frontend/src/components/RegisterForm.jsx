import React, { useState } from 'react';
import { registerUser } from '../services/auth.js';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
    username: '',
    email: '',
    address: '',
    password: '',
    password2: '',
    profile_img: null,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      first_name, last_name, gender, age,
      username, email, address, password,
      password2, profile_img
    } = formData;

    if (!first_name || !last_name || !gender || !age || !username || !email || !address || !password || !password2) {
      setError('All fields except profile image are required');
      return;
    }

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    try {
      const response = await registerUser(payload);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-black grid gap-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2 animate-pulse">Musta Social</h1>
        {error && <div className="text-red-500">{error}</div>}

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="first_name" placeholder="First Name" className="input" onChange={handleChange} />
          <input name="last_name" placeholder="Last Name" className="input" onChange={handleChange} />
          <select name="gender" className="input" onChange={handleChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="age" type="number" placeholder="Age" className="input" onChange={handleChange} />
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" placeholder="Username" className="input" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" className="input" onChange={handleChange} />
        </div>

        <input name="address" placeholder="Address" className="input" onChange={handleChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="password" type="password" placeholder="Password" className="input" onChange={handleChange} />
          <input name="password2" type="password" placeholder="Confirm Password" className="input" onChange={handleChange} />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block mb-2 font-medium">Profile Image (optional)</label>
          <input name="profile_img" type="file" accept="image/*" onChange={handleChange} className="w-full" />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md w-full hover:bg-blue-700 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;