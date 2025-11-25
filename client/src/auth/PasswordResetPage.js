import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetPage = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('/api/auth/reset-password', { token, newPassword });
      setMessage('Your password has been reset. You can now log in.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Set New Password</h2>
        <input
          type="text"
          name="token"
          placeholder="Enter your reset token"
          value={token}
          onChange={e => setToken(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-[#8E44AD] text-white py-2 rounded hover:bg-[#732d91] transition">
          Reset Password
        </button>
        {message && <div className="text-green-500 mt-4 text-center">{message}</div>}
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default PasswordResetPage;
