import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand">Smart Parking</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/parking">Parking</Link>
          <Link to="/reservations">Reservations</Link>
        </nav>
        <div className="user-box">
          <span>{user?.fullName}</span>
          <button onClick={handleLogout}>Dil</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
