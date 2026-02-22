import React, { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import API from "../services/Api";
import { ThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Handle Email Auth
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      }

      const firebaseUser = userCredential.user;

      // Send to backend
      const res = await API.post("/users", {
        firebaseUID: firebaseUser.uid,
        email: firebaseUser.email,
        name: formData.name || firebaseUser.email,
      });

      // Save Mongo _id
      localStorage.setItem("userId", res.data._id);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ===========================
  // Google Auth
  // ===========================
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      const res = await API.post("/users", {
        firebaseUID: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
      });

      localStorage.setItem("userId", res.data._id);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      setError("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg">
      <div className="w-96 p-8 rounded-2xl shadow-lg bg-white dark:bg-darkCard">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
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
              className="w-full p-3 rounded-lg border"
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-lightAccent text-white"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="my-6 text-center">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-xl border"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm">
          {isLogin ? "Don't have an account?" : "Already have one?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 cursor-pointer text-lightAccent"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;