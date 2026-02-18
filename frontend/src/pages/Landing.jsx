import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Landing() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="min-h-screen transition-colors duration-500
      bg-lightBg text-lightText
      dark:bg-darkBg dark:text-darkText"
    >

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6
        border-b border-gray-200
        dark:border-darkBorder"
      >
        <h1 className="text-2xl font-bold">
          StockMonitor
        </h1>

        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg border
              border-gray-300
              dark:border-darkBorder
              hover:bg-gray-100
              dark:hover:bg-darkCard
              transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg font-medium
              bg-lightAccent text-white
              dark:bg-darkAccent dark:text-black
              hover:opacity-90 transition"
          >
            Login
          </button>

        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center
        text-center px-6 py-24"
      >

        <h2 className="text-5xl font-bold max-w-3xl leading-tight">
          Professional Real-Time Portfolio Management
        </h2>

        <p className="mt-6 text-lg max-w-2xl
          text-lightMuted
          dark:text-gray-400"
        >
          Track investments, monitor live stock prices,
          analyze performance, and make smarter financial decisions.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-10 px-8 py-4 rounded-xl text-lg font-semibold
            bg-lightSecondary text-white
            dark:bg-darkAccent dark:text-black
            hover:opacity-90 transition"
        >
          Get Started
        </button>

      </div>

      {/* Feature Section */}
      <div className="grid grid-cols-3 gap-10 px-20 pb-24">

        {[
          {
            title: "Real-Time Prices",
            desc: "Live stock tracking powered by market data APIs."
          },
          {
            title: "Portfolio Analytics",
            desc: "Automatic profit/loss calculation and insights."
          },
          {
            title: "Historical Charts",
            desc: "Visualize trends with detailed market data."
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="p-8 rounded-xl border
              border-gray-200
              bg-white
              dark:bg-darkCard
              dark:border-darkBorder
              shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3">
              {feature.title}
            </h3>
            <p className="text-lightMuted dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}
