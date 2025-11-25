import React from 'react';

const MyBookingsPage = () => {
  const bookings = [
    {
      id: 1,
      roomType: "Deluxe Room",
      startDate: "2025-11-10",
      endDate: "2025-11-14",
    },
    {
      id: 2,
      roomType: "Suite",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8">
      <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6 text-center">My Bookings</h2>

      {bookings.map(booking => (
        <div key={booking.id} className="bg-white shadow rounded p-4 mb-4">
          <h3 className="text-lg font-semibold text-[#2C3E50]">{booking.roomType}</h3>
          <p className="text-sm text-gray-700">Check-in: <span className="font-medium">{booking.startDate}</span></p>
          <p className="text-sm text-gray-700">Check-out: <span className="font-medium">{booking.endDate}</span></p>
        </div>
      ))}
    </div>
  );
};

export default MyBookingsPage;
