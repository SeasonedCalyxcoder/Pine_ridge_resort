import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: "Tracy Wanjiru",
    email: "tracy@example.com",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ This is the missing hook your app is looking for
export const useAuth = () => useContext(AuthContext);

export { AuthContext };
