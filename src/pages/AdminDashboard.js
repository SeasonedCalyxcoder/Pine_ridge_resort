import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-serif text-[#2C3E50] mb-4">Welcome, Admin</h2>
        <p className="text-gray-700 mb-6">Logged in as: <strong>{user?.email}</strong></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/rooms"
            className="bg-[#8E44AD] hover:bg-[#732d91] text-white font-semibold py-4 px-6 rounded text-center transition duration-300"
          >
            Manage Rooms
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-[#8E44AD] hover:bg-[#732d91] text-white font-semibold py-4 px-6 rounded text-center transition duration-300"
          >
            View Bookings
          </Link>
          <Link
            to="/admin/reports"
            className="bg-[#8E44AD] hover:bg-[#732d91] text-white font-semibold py-4 px-6 rounded text-center transition duration-300"
          >
            Analytics & Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
