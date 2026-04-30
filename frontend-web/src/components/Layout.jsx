import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "Guest";
  const isPrivileged = role === "Admin" || role === "Operator";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand">Smart Parking</h1>
        <nav>
          <Link to="/dashboard">{isPrivileged ? "Admin Dashboard" : "My Dashboard"}</Link>
          <Link to="/parking">Parking</Link>
          <Link to="/reservations">{isPrivileged ? "Reservations" : "My Reservations"}</Link>
        </nav>
        <div className="user-box">
          <span>{user?.fullName}</span>
          <span className="role-chip">{role}</span>
          <button onClick={handleLogout}>Dil</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
