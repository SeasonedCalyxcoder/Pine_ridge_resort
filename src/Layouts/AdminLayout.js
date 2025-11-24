import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Rooms', path: '/admin/rooms' },
    { name: 'Bookings', path: '/admin/bookings' },
    { name: 'Reports', path: '/admin/reports' },
    { name: 'Profile', path: '/profile' },
    { name: 'Logout', path: '/logout' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C3E50] text-white flex flex-col py-8 px-6">
        <h2 className="text-2xl font-serif mb-10">Admin Panel</h2>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === item.path
                  ? 'bg-[#E67E22]'
                  : 'hover:bg-[#34495E]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
