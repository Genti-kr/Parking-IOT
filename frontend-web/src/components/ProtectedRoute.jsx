import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="fullscreen-state">
        <div className="spinner" aria-hidden="true" />
        <p>Duke verifikuar sesionin...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
