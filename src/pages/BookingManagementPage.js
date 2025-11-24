import React, { useState } from 'react';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      guest: 'Tracy',
      room: 'Deluxe King',
      checkIn: '2025-11-10',
      checkOut: '2025-11-15',
      status: 'Pending',
    },
    {
      id: 2,
      guest: 'Brian',
      room: 'Standard Queen',
      checkIn: '2025-11-08',
      checkOut: '2025-11-12',
      status: 'Confirmed',
    },
    {
      id: 3,
      guest: 'Aisha',
      room: 'Executive Suite',
      checkIn: '2025-11-09',
      checkOut: '2025-11-14',
      status: 'Checked-in',
    },
  ]);

  const updateStatus = (id, newStatus) => {
    const updated = bookings.map(b =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-serif text-[#2C3E50] mb-8 text-center">Booking Management</h2>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-[#2C3E50] text-white">
              <th className="px-4 py-2 text-left">Guest</th>
              <th className="px-4 py-2 text-left">Room</th>
              <th className="px-4 py-2 text-left">Check-In</th>
              <th className="px-4 py-2 text-left">Check-Out</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="px-4 py-2">{booking.guest}</td>
                <td className="px-4 py-2">{booking.room}</td>
                <td className="px-4 py-2">{booking.checkIn}</td>
                <td className="px-4 py-2">{booking.checkOut}</td>
                <td className="px-4 py-2">{booking.status}</td>
                <td className="px-4 py-2 space-x-2">
                  {booking.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, 'Confirmed')}
                        className="bg-[#27AE60] hover:bg-[#1E8449] text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'Cancelled')}
                        className="bg-[#E74C3C] hover:bg-[#C0392B] text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'Checked-in')}
                      className="bg-[#3498DB] hover:bg-[#2980B9] text-white px-3 py-1 rounded"
                    >
                      Check-in
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagementPage;
