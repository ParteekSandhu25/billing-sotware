import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}
