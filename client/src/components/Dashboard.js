import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";
import UserBookings from "./UserBookings";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <UserAvatar name={user?.name} />
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || "Guest"}!
        </h2>
      </div>
      <p className="text-gray-600 mb-6">Here are your latest bookings and preferences.</p>
      <UserBookings />
    </div>
  );
};

export default Dashboard;
