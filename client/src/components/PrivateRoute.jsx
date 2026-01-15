import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {

  // Check if user is authenticated by looking for userInfo in localStorage
  const userInfo = localStorage.getItem("userInfo");

  // If user is not logged in, redirect to login page
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, allow access to the protected route
  return children;
};

export default PrivateRoute;
