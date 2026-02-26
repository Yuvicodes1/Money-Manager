import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaWallet,
  FaSearch,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const NAV_ITEMS = [
  { to: "/dashboard", icon: <FaChartPie />, label: "Dashboard" },
  { to: "/portfolio", icon: <FaWallet />,   label: "Portfolio" },
  { to: "/market",    icon: <FaSearch />,   label: "Market"    },
  { to: "/settings",  icon: <FaCog />,      label: "Settings"  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItemClasses =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";
  const activeClasses =
    "bg-lightAccent text-white dark:bg-darkAccent dark:text-black";
  const inactiveClasses =
    "text-lightMuted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkCard";

  const navLinks = (
    <nav className="flex flex-col gap-3">
      {NAV_ITEMS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* ── Desktop sidebar (md and above) ─────────────────────────────── */}
      <aside
        className="w-64 min-h-screen px-6 py-8
        bg-white dark:bg-darkCard
        border-r border-gray-200 dark:border-darkBorder
        hidden md:block"
      >
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-lightAccent dark:text-darkAccent">
            Stock Manager
          </h2>
        </div>
        {navLinks}
      </aside>

      {/* ── Mobile header bar (below md) ───────────────────────────────── */}
      <div className="md:hidden">
        {/* Top bar with logo + hamburger */}
        <div
          className="flex justify-between items-center px-5 py-4
          bg-white dark:bg-darkCard
          border-b border-gray-200 dark:border-darkBorder"
        >
          <h2 className="text-xl font-bold text-lightAccent dark:text-darkAccent">
            Stock Manager
          </h2>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-lg
            text-lightMuted dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-darkBg transition"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Inline expanding menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
            bg-white dark:bg-darkCard
            border-b border-gray-200 dark:border-darkBorder
            ${mobileOpen ? "max-h-96 px-5 py-4" : "max-h-0"}`}
        >
          {navLinks}
        </div>
      </div>
    </>
  );
}