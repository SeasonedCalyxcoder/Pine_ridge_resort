import React, { useState } from 'react';

const initialRooms = [
  { id: 1, type: 'Deluxe King', price: 'Ksh 12,000', status: 'Available' },
  { id: 2, type: 'Standard Queen', price: 'Ksh 8,500', status: 'Occupied' },
  { id: 3, type: 'Executive Suite', price: 'Ksh 18,000', status: 'Available' },
];

const statusColor = {
  Available: 'bg-green-100 text-green-700',
  Occupied: 'bg-red-100 text-red-700',
};

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ type: '', price: '', status: 'Available' });

  const handleAddRoom = () => {
    const id = rooms.length + 1;
    setRooms([...rooms, { id, ...newRoom }]);
    setNewRoom({ type: '', price: '', status: 'Available' });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-12">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif text-[#2C3E50]">Room Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#8E44AD] hover:bg-[#732d91] text-white px-4 py-2 rounded"
          >
            + Add Room
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#2C3E50] text-white">
                <th className="px-4 py-2 text-left">Room Type</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b">
                  <td className="px-4 py-3">{room.type}</td>
                  <td className="px-4 py-3">{room.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[room.status]}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="bg-[#3498DB] hover:bg-[#2980B9] text-white px-4 py-2 rounded text-sm">
                      Edit
                    </button>
                    <button className="bg-[#C0392B] hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Room</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Type"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Price"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <select
                value={newRoom.status}
                onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
              </select>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoom}
                  className="px-4 py-2 rounded bg-[#8E44AD] hover:bg-[#732d91] text-white"
                >
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagementPage;
 