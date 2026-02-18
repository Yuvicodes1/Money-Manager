import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-lightBg text-lightText
      dark:bg-darkBg dark:text-darkText"
    >
      <div className="w-96 p-8 rounded-xl shadow-lg
        bg-white
        dark:bg-darkCard"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded border border-gray-300
          dark:border-darkBorder dark:bg-darkBg"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded border border-gray-300
          dark:border-darkBorder dark:bg-darkBg"
        />

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 rounded-lg font-semibold
            bg-lightAccent text-white
            dark:bg-darkAccent dark:text-black
            hover:opacity-90 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
