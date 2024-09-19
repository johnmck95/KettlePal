import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../generated/frontend-types";

const LOCAL_STORAGE_USER_KEY = "user";

interface UserProviderProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const defaultContextValue: UserProviderProps = {
  user: null,
  login: () => {},
  logout: () => {},
};

const UserContext = createContext<UserProviderProps>(defaultContextValue);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Callers responsibility to hit the login endpoint
  const login = (userData: User) => {
    setUser(userData);
  };

  // Callers responsibility to hit the invalidateToken endpoint
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const value: UserProviderProps = {
    user,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Use a custom hook to access the context
export const useUser = (): UserProviderProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
