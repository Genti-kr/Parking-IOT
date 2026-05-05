<<<<<<< HEAD
import { Link, Outlet, useNavigate } from "react-router-dom";
=======
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const initials = useMemo(() => {
    const source = user?.fullName?.trim() || user?.email?.trim() || "User";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return source.slice(0, 2).toUpperCase();
  }, [user?.fullName, user?.email]);
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
<<<<<<< HEAD
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
=======
      <header className="top-nav">
        <div className="top-nav-brand">
          <span className="top-nav-brand-icon">🚘</span>
          <strong>Smart Parking System</strong>
        </div>
        <nav className="top-nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          {!isAdmin && (
            <NavLink to="/vehicles" className={({ isActive }) => (isActive ? "active" : "")}>
              My Vehicles
            </NavLink>
          )}
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? "active" : "")}>
            Reservations
          </NavLink>
          {isAdmin && (
            <NavLink to="/parking" className={({ isActive }) => (isActive ? "active" : "")}>
              Payments
            </NavLink>
          )}
        </nav>
        <div className="topbar-user-menu">
          <button
            type="button"
            className="topbar-user-trigger"
            onClick={() => setOpenUserMenu((prev) => !prev)}
          >
            <span className="topbar-user-avatar">{initials}</span>
            <span className="topbar-user-name">{user?.fullName || "User"}</span>
            <span className="topbar-user-caret">{openUserMenu ? "▴" : "▾"}</span>
          </button>
          {openUserMenu && (
            <div className="topbar-user-dropdown">
              <button type="button" className="topbar-user-dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
