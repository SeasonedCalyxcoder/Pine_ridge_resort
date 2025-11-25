import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div
    className="min-h-screen bg-cover bg-center flex items-center justify-center text-white"
    style={{ backgroundImage: "url('/assets/hero.jpg')" }}
  >
    <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center max-w-2xl">
      <h1 className="text-5xl font-serif mb-4 tracking-wide">Welcome to Pine Ridge Hotel</h1>
      <p className="text-lg mb-6">
        Discover serenity, luxury, and unforgettable experiences at our resort and spa. Your escape begins here.
      </p>
      <Link
        to="/book"
        className="bg-[#8E44AD] hover:bg-[#732d91] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300"
      >
        Book Your Stay
      </Link>
    </div>
  </div>
);

export default HomePage;
