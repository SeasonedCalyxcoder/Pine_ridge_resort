import React, { useEffect, useState } from 'react';
import axios from 'axios';
import rooms from '../data/roomData';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ start_date: '', end_date: '', guests: 1 });
  // Helper to format date for input type="date"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Handles both yyyy-MM-dd and ISO string
    return dateStr.length > 10 ? dateStr.slice(0, 10) : dateStr;
  };

  const openEdit = (booking) => {
    setEditId(booking.id);
    setEditForm({
      start_date: formatDate(booking.start_date),
      end_date: formatDate(booking.end_date),
      guests: booking.guests
    });
  };

  const closeEdit = () => {
    setEditId(null);
    setEditForm({ start_date: '', end_date: '', guests: 1 });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/booking/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(bookings.map(b => b.id === editId ? { ...b, ...editForm } : b));
      closeEdit();
    } catch (err) {
      if (err.response?.status === 404) {
        alert('You do not own this booking or it does not exist.');
      } else {
        alert('Failed to update booking.');
      }
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/booking/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : `Room #${roomId}`;
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.delete(`/api/booking/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(bookings.filter(b => b.id !== id));
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8">
      <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6 text-center">My Bookings</h2>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {bookings.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500">No bookings found.</div>
      )}
      {bookings.map(booking => (
        <div key={booking.id} className="bg-white shadow rounded p-4 mb-4">
          <h3 className="text-lg font-semibold text-[#2C3E50]">{getRoomName(booking.room_id)}</h3>
          {editId === booking.id ? (
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <label className="block text-sm">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={editForm.start_date}
                onChange={handleEditChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <label className="block text-sm">End Date</label>
              <input
                type="date"
                name="end_date"
                value={editForm.end_date}
                onChange={handleEditChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <label className="block text-sm">Guests</label>
              <input
                type="number"
                name="guests"
                min={1}
                value={editForm.guests}
                onChange={handleEditChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-[#8E44AD] text-white px-4 py-1 rounded hover:bg-[#732d91] transition">Save</button>
                <button type="button" className="bg-gray-300 text-gray-700 px-4 py-1 rounded" onClick={closeEdit}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-sm text-gray-700">Check-in: <span className="font-medium">{booking.start_date}</span></p>
              <p className="text-sm text-gray-700">Check-out: <span className="font-medium">{booking.end_date}</span></p>
              <p className="text-sm text-gray-700">Guests: <span className="font-medium">{booking.guests}</span></p>
              <p className="text-sm text-gray-700">Status: <span className="font-medium">{booking.status}</span></p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => openEdit(booking)}
                >
                  Edit Booking
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel Booking
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookingsPage;
