import React, { useState } from 'react';
import rooms from '../data/roomData';

const amenities = {
  "Standard Room": ["Wi-Fi", "TV", "Workspace"],
  "Deluxe Room": ["Wi-Fi", "TV", "City View", "Mini Bar"],
  "Suite": ["Wi-Fi", "TV", "Lounge", "Luxury Bath", "Room Service"],
  "Executive Room": ["Wi-Fi", "TV", "Workspace", "Coffee Maker", "Priority Check-in"],
  "Romantic Getaway": ["Wi-Fi", "Scenic View", "Ambient Lighting", "Couples Spa Access"],
};

const BookingPage = () => {
  const [filter, setFilter] = useState("All");

  const filteredRooms =
    filter === "All" ? rooms : rooms.filter(room => room.name.includes(filter));

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8">
      <h2 className="text-3xl font-serif text-[#2C3E50] mb-6 text-center tracking-wide">
        Available Rooms
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["All", "Standard", "Deluxe", "Suite", "Executive", "Romantic"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full border ${
              filter === type ? "bg-[#8E44AD] text-white" : "bg-white text-[#8E44AD]"
            } hover:bg-[#732d91] hover:text-white transition`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-1">
                {room.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{room.description}</p>
              <p className="text-base text-[#8E44AD] font-semibold mb-2">
                {room.price}
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Amenities */}
              <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
                {amenities[room.name]?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <button className="bg-[#8E44AD] text-white px-5 py-2 rounded-full hover:bg-[#732d91] transition">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;
