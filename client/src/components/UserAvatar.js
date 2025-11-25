const UserAvatar = ({ name }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
      {initials}
    </div>
  );
};

export default UserAvatar;
