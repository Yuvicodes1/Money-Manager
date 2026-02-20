import React, { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { darkMode } = useContext(ThemeContext);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.length >= 8
    )
      return "Strong";
    return "Medium";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    console.log(isLogin ? "Login" : "Signup", formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-500
      bg-lightBg text-lightText
      dark:bg-darkBg dark:text-darkText"
    >
      <div
        className="w-96 p-8 rounded-2xl shadow-lg transition
        bg-white dark:bg-darkCard
        border border-gray-200 dark:border-darkBorder"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-lightAccent dark:text-darkAccent">
          {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg border
              bg-white dark:bg-darkBg
              border-gray-300 dark:border-darkBorder
              focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border
            bg-white dark:bg-darkBg
            border-gray-300 dark:border-darkBorder
            focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg border
              bg-white dark:bg-darkBg
              border-gray-300 dark:border-darkBorder"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Strength Indicator */}
          {!isLogin && formData.password && (
            <p className="text-sm">
              Strength:{" "}
              <span
                className={
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {passwordStrength}
              </span>
            </p>
          )}

          {/* Confirm Password */}
          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg border
                bg-white dark:bg-darkBg
                border-gray-300 dark:border-darkBorder"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold
            bg-lightAccent text-white
            dark:bg-darkAccent dark:text-black
            hover:scale-105 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-darkBorder"></div>
          <span className="mx-3 text-sm text-lightMuted dark:text-gray-400">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-darkBorder"></div>
        </div>

        {/* Google Button */}
        <button
          className="w-full flex items-center justify-center gap-3
          p-3 rounded-xl border
          border-gray-300 dark:border-darkBorder
          hover:bg-gray-100 dark:hover:bg-darkCard
          transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        {/* Toggle */}
        <p className="text-center mt-6 text-sm text-lightMuted dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 cursor-pointer font-medium
            text-lightAccent dark:text-darkAccent"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;