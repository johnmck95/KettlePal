import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to the login page if there's no user
    // Save the current location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
