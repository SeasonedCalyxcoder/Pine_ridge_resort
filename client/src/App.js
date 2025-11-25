import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import PasswordResetRequestPage from './auth/PasswordResetRequestPage';
import PasswordResetPage from './auth/PasswordResetPage';
import TwoFAPage from './auth/TwoFAPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './Layouts/AdminLayout';
import HomePage from './pages/Homepage';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-[#2C3E50] text-white px-6 py-5 shadow-lg">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Pine Ridge Logo" className="w-10 h-10 logo-sway" />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-serif tracking-wide">Pine Ridge Hotel</span>
            <span className="text-sm italic text-[#BDC3C7]">Resort & Spa</span>
          </div>
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <ul className="hidden md:flex gap-6 text-base font-medium">
          <li><Link to="/" className="hover:text-[#E67E22] transition">Home</Link></li>
          <li><Link to="/book" className="hover:text-[#E67E22] transition">Book</Link></li>
          <li><Link to="/bookings" className="hover:text-[#E67E22] transition">My Bookings</Link></li>
          {user?.role === 'Admin' && (
            <li><Link to="/admin/dashboard" className="hover:text-[#E67E22] transition">Admin</Link></li>
          )}
          {user ? (
            <li><button onClick={handleLogout} className="hover:text-[#E67E22] transition">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-[#E67E22] transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-[#E67E22] transition">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>

      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 text-base font-medium">
          <li><Link to="/" className="hover:text-[#E67E22] transition">Home</Link></li>
          <li><Link to="/book" className="hover:text-[#E67E22] transition">Book</Link></li>
          <li><Link to="/bookings" className="hover:text-[#E67E22] transition">My Bookings</Link></li>
          {user?.role === 'Admin' && (
            <li><Link to="/admin/dashboard" className="hover:text-[#E67E22] transition">Admin</Link></li>
          )}
          {user ? (
            <li><button onClick={handleLogout} className="hover:text-[#E67E22] transition">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-[#E67E22] transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-[#E67E22] transition">Sign Up</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};


function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<PasswordResetRequestPage />} />
        <Route path="/set-password" element={<PasswordResetPage />} />
        <Route path="/2fa" element={<TwoFAPage />} />
        <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
        <Route path="/book" element={user ? <BookingPage /> : <LoginPage />} />
        <Route path="/bookings" element={user ? <MyBookingsPage /> : <LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <footer className="bg-[#2C3E50] text-white py-4 px-4 text-center mt-12 text-sm">
        <p>&copy; 2025 Pine Ridge Resort & Spa. All rights reserved.</p>
        <p>Contact: info@pineridgehotel.com | +254 712 345678</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans">
          <Navbar />
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
