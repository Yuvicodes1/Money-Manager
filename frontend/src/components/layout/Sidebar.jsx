import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaWallet,
  FaSearch,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  const navItemClasses =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  const activeClasses =
    "bg-lightAccent text-white dark:bg-darkAccent dark:text-black";

  const inactiveClasses =
    "text-lightMuted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkCard";

  return (
    <aside
      className="w-64 min-h-screen px-6 py-8
      bg-white dark:bg-darkCard
      border-r border-gray-200 dark:border-darkBorder
      hidden md:block"
    >
      {/* Logo */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-lightAccent dark:text-darkAccent">
          Stock Manager
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${navItemClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`
          }
        >
          <FaChartPie />
          Dashboard
        </NavLink>

        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `${navItemClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`
          }
        >
          <FaWallet />
          Portfolio
        </NavLink>

        <NavLink
          to="/market"
          className={({ isActive }) =>
            `${navItemClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`
          }
        >
          <FaSearch />
          Market
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${navItemClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`
          }
        >
          <FaCog />
          Settings
        </NavLink>

      </nav>
    </aside>
  );
}