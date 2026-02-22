import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Market from "../pages/Market";
import StockDetails from "../pages/StockDetails";
import ProtectedRoute from "../components/ProtectedRoute";

function Placeholder({ title }) {
  return <div className="p-10">{title} Page Coming Soon</div>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock/:symbol"
          element={
            <ProtectedRoute>
              <StockDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Placeholder title="Portfolio" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Placeholder title="Settings" />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}