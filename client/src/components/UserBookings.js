import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import bookings from "../data/bookings";

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const userBookings = bookings.filter((b) => b.userId === user?.id);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Bookings</h3>
      {userBookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {userBookings.map((booking) => (
            <li key={booking.id} className="bg-white p-4 rounded-lg shadow">
              <strong>{booking.roomName}</strong> — {booking.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookings;
