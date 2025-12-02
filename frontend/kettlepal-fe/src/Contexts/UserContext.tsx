import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { CheckSessionQuery } from "../generated/frontend-types";
import { useCheckSession } from "../Hooks/useCheckSession";

const SESSION_STORAGE_USER_KEY = "user";

export type UserInContext =
  | CheckSessionQuery["checkSession"]["user"]
  | null
  | undefined;

interface UserProviderProps {
  user: UserInContext;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  error: any;
}

const defaultContextValue: UserProviderProps = {
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  error: null,
};

const UserContext = createContext<UserProviderProps>(defaultContextValue);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInContext | null>(() => {
    const savedUser = sessionStorage.getItem(SESSION_STORAGE_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // Since the server validates the HTTP-only tokens, we need to poll just in case
  // the user deletes their cookies. Logout will keep this in sync.
  const { data, loading, error, refetch } = useCheckSession();

  useEffect(() => {
    if (data) {
      if (data.checkSession.isValid) {
        sessionStorage.setItem(
          SESSION_STORAGE_USER_KEY,
          JSON.stringify(data.checkSession.user)
        );
        setUser(data.checkSession.user);
      } else {
        setUser(null);
      }
    }
  }, [data]);

  const login = () => {
    // Verify tokens were created, then store user in state
    refetch();
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_USER_KEY);
    setUser(null);
    // Verify tokens were invalidated, then remove user from state
    refetch();
  };

  const value: UserProviderProps = {
    user,
    login,
    logout,
    isLoading: loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserProviderProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
