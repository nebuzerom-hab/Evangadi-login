// AdminRoute.js
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (!decoded.is_admin) {
      return <Navigate to="/" replace />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
