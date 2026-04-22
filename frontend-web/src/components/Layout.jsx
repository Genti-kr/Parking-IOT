import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
        <div className="brand-wrap">
          <h1 className="brand">Smart Parking</h1>
          <p className="brand-subtitle">Admin Console</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/parking">Parking</NavLink>
          <NavLink to="/reservations">Reservations</NavLink>
        </nav>
        <div className="user-box">
          <span className="user-name">{user?.fullName || "Administrator"}</span>
          <span className="user-role">{user?.role || "Operator"}</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Dil
          </button>
        </div>
      </aside>
      <main className="content">
        <header className="page-header">
          <h2 className="page-title">Parking Management</h2>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
