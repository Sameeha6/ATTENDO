
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");

//   if (!role) {
//     return <Navigate to="/login" replace />;
//   }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/*" replace />;
  }

  return children;
};

export default ProtectedRoute;
