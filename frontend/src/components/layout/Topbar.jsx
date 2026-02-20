import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Topbar({ title }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <header
      className="flex justify-between items-center
      px-8 py-4
      bg-white/70 dark:bg-darkBg/70
      backdrop-blur-md
      border-b border-gray-200 dark:border-darkBorder
      sticky top-0 z-40"
    >
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">
        {title}
      </h1>

      {/* Right Controls */}
      <div className="flex items-center gap-6">

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg border
          border-gray-300 dark:border-darkBorder
          hover:bg-gray-100 dark:hover:bg-darkCard transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* User Avatar Placeholder */}
        <div
          className="w-9 h-9 rounded-full
          bg-lightAccent dark:bg-darkAccent
          flex items-center justify-center
          text-white dark:text-black font-bold"
        >
          U
        </div>

      </div>
    </header>
  );
}