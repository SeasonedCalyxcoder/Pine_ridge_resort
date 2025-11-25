import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', // backend expects username
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      });
      if (response.data.twoFARequired) {
        // Redirect to 2FA page with username and code
        navigate('/2fa', { state: { username: formData.username, code: response.data.code } });
        return;
      }
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/book');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Log In</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        {error && (
          <div className="text-red-500 mb-2 text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-[#8E44AD] text-white py-2 rounded hover:bg-[#732d91] transition"
        >
          Log In
        </button>

        <p className="mt-4 text-sm text-center">
          <span
            className="text-[#8E44AD] cursor-pointer hover:underline"
            onClick={() => navigate('/reset-password')}
          >
            Forgot Password?
          </span>
        </p>
        <p className="mt-2 text-sm text-center">
          Don’t have an account?{' '}
          <span
            className="text-[#8E44AD] cursor-pointer hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
