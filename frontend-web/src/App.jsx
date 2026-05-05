import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
<<<<<<< HEAD
=======
import MyVehicles from "./pages/MyVehicles.jsx";
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
import ParkingSlots from "./pages/ParkingSlots.jsx";
import Register from "./pages/Register.jsx";
import Reservations from "./pages/Reservations.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
=======
        <Route path="/vehicles" element={<MyVehicles />} />
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
        <Route path="/parking" element={<ParkingSlots />} />
        <Route path="/reservations" element={<Reservations />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}