import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const TwoFAPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { username, code } = location.state || {};

  const [inputCode, setInputCode] = useState(code || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/verify-2fa', {
        username,
        code: inputCode
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/book');
    } catch (err) {
      setError(err.response?.data?.error || '2FA verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Two-Factor Authentication</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">Enter the 6-digit code provided after login.</p>
        <input
          type="text"
          name="code"
          placeholder="Enter 2FA code"
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 border rounded"
        />
        {error && (
          <div className="text-red-500 mb-2 text-center">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-[#8E44AD] text-white py-2 rounded hover:bg-[#732d91] transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default TwoFAPage;
