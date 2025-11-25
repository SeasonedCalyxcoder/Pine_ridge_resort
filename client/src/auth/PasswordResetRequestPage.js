import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequestPage = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setResetToken('');
    try {
      const response = await axios.post('/api/auth/forgot-password', { username });
      setMessage('If this username exists, a password reset link will be sent.');
      if (response.data.token) {
        setResetToken(response.data.token);
      }
    } catch (err) {
      setError('Error sending reset request.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Reset Password</h2>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-[#8E44AD] text-white py-2 rounded hover:bg-[#732d91] transition">
          Send Reset Link
        </button>
        {message && <div className="text-green-500 mt-4 text-center">{message}</div>}
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        {resetToken && (
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-600">Demo token (use on <b>Set New Password</b> page):</div>
            <div className="text-xs break-all bg-gray-100 p-2 rounded mt-1">{resetToken}</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PasswordResetRequestPage;
