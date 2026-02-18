import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Dashboard() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="min-h-screen
      bg-lightBg text-lightText
      dark:bg-darkBg dark:text-darkText
      transition-colors duration-500"
    >
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="p-6 rounded-xl
          bg-white
          dark:bg-darkCard
          shadow-sm"
        >
          <p>This is your portfolio dashboard.</p>
        </div>
      </div>
    </div>
  );
}
