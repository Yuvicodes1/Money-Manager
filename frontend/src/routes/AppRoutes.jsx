import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

function Placeholder({ title }) {
  return <div className="p-10">{title} Page Coming Soon</div>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Placeholder title="Portfolio" />} />
        <Route path="/market" element={<Placeholder title="Market" />} />
        <Route path="/settings" element={<Placeholder title="Settings" />} />
      </Routes>
    </BrowserRouter>
  );
}