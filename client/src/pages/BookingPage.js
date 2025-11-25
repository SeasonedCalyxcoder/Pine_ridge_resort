import React, { useState } from 'react';
import rooms from '../data/roomData';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const amenities = {
  "Standard Room": ["Wi-Fi", "TV", "Workspace"],
  "Deluxe Room": ["Wi-Fi", "TV", "City View", "Mini Bar"],
  "Suite": ["Wi-Fi", "TV", "Lounge", "Luxury Bath", "Room Service"],
  "Executive Room": ["Wi-Fi", "TV", "Workspace", "Coffee Maker", "Priority Check-in"],
  "Romantic Getaway": ["Wi-Fi", "Scenic View", "Ambient Lighting", "Couples Spa Access"],
};

const BookingPage = () => {
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ start_date: '', end_date: '', guests: 1 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'done'
  const [paymentInfo, setPaymentInfo] = useState({ method: 'Card', card: '', mpesa: '' });
  // const { user } = useAuth(); // Not used, so removed

  const filteredRooms =
    filter === "All" ? rooms : rooms.filter(room => room.name.includes(filter));

  const openModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setForm({ start_date: '', end_date: '', guests: 1 });
    setMessage('');
    setError('');
    setStep('details');
    setPaymentInfo({ method: 'Card', card: '', mpesa: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setStep('details');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    // Simulate payment validation
    if (paymentInfo.method === 'Card' && paymentInfo.card.length < 8) {
      setError('Please enter a valid card number.');
      return;
    }
    if (paymentInfo.method === 'M-Pesa' && paymentInfo.mpesa.length < 8) {
      setError('Please enter a valid M-Pesa number.');
      return;
    }
    try {
      const res = await axios.post('/api/booking', {
        room_id: selectedRoom.id,
        start_date: form.start_date,
        end_date: form.end_date,
        guests: form.guests
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Payment successful! ' + res.data.message);
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setStep('payment');
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8">
      <h2 className="text-3xl font-serif text-[#2C3E50] mb-6 text-center tracking-wide">
        Available Rooms
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {['All', 'Standard', 'Deluxe', 'Suite', 'Executive', 'Romantic'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full border ${
              filter === type ? 'bg-[#8E44AD] text-white' : 'bg-white text-[#8E44AD]'
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
              <div className="flex gap-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
                {amenities[room.name]?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button
                className="bg-[#8E44AD] text-white px-5 py-2 rounded-full hover:bg-[#732d91] transition"
                onClick={() => openModal(room)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-4 text-center">Book {selectedRoom.name}</h3>
            {step === 'details' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <label className="block text-sm">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <label className="block text-sm">Guests</label>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  value={form.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-[#8E44AD] text-white py-2 rounded hover:bg-[#732d91] transition"
                >
                  Next: Payment
                </button>
              </form>
            )}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <label className="block text-sm">Payment Method</label>
                <select
                  name="method"
                  value={paymentInfo.method}
                  onChange={e => setPaymentInfo({ ...paymentInfo, method: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Card">Card</option>
                  <option value="M-Pesa">M-Pesa</option>
                </select>
                {paymentInfo.method === 'Card' && (
                  <input
                    type="text"
                    name="card"
                    placeholder="Card Number"
                    value={paymentInfo.card}
                    onChange={e => setPaymentInfo({ ...paymentInfo, card: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                )}
                {paymentInfo.method === 'M-Pesa' && (
                  <input
                    type="text"
                    name="mpesa"
                    placeholder="M-Pesa Number"
                    value={paymentInfo.mpesa}
                    onChange={e => setPaymentInfo({ ...paymentInfo, mpesa: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                )}
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-[#8E44AD] text-white py-2 rounded hover:bg-[#732d91] transition"
                >
                  Pay & Confirm Booking
                </button>
              </form>
            )}
            {step === 'done' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-green-600 text-lg font-semibold mb-4">{message}</div>
                <button
                  className="bg-[#8E44AD] text-white px-6 py-2 rounded hover:bg-[#732d91] transition"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
