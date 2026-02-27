import { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import API from "../services/Api";
import { ThemeContext } from "../context/ThemeContext";

// ── Password strength calculator ─────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair",   color: "bg-orange-400" };
  if (score <= 3) return { score, label: "Good",   color: "bg-yellow-400" };
  if (score <= 4) return { score, label: "Strong", color: "bg-green-400" };
  return              { score, label: "Very Strong", color: "bg-emerald-500" };
}

export default function Login() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.name });
      }
      const firebaseUser = userCredential.user;
      const res = await API.post("/users", {
        firebaseUID: firebaseUser.uid,
        email: firebaseUser.email,
        name: formData.name || firebaseUser.displayName || firebaseUser.email,
      });
      localStorage.setItem("userId", res.data._id);
      navigate("/home");
    } catch (err) {
      const msgs = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/email-already-in-use": "Email already in use. Try logging in.",
        "auth/weak-password": "Password must be at least 6 characters.",
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
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
      navigate("/home");
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = [
    "w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200",
    "bg-white/60 dark:bg-darkBg/60 backdrop-blur-sm",
    "text-lightText dark:text-darkText",
    "placeholder-gray-400 dark:placeholder-gray-500",
    "border-gray-300 dark:border-darkBorder",
    "focus:outline-none focus:ring-2 focus:ring-lightAccent dark:focus:ring-darkAccent",
    "focus:border-transparent focus:scale-[1.01]",
  ].join(" ");

  return (
    <div className="min-h-screen flex transition-colors duration-500
      bg-lightBg dark:bg-darkBg"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .anim-slide-in { animation: slideIn 0.6s ease both; }
        .anim-fade-up  { animation: fadeUp  0.5s ease both; }
        .anim-float    { animation: float   3s ease-in-out infinite; }
        .anim-delay-1  { animation-delay: 0.1s; }
        .anim-delay-2  { animation-delay: 0.2s; }
        .anim-delay-3  { animation-delay: 0.3s; }
        .anim-delay-4  { animation-delay: 0.4s; }
        .anim-delay-5  { animation-delay: 0.5s; }
      `}</style>

      {/* ── Left panel — decorative (desktop only) ───────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: darkMode
          ? "linear-gradient(145deg, #0F1A14 0%, #1C2A23 50%, #071108 100%)"
          : "linear-gradient(145deg, #480355 0%, #8B1874 50%, #DDA448 100%)" }}>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/noise.png')" }} />

        {/* Floating orbs */}
        <div className="absolute top-20 right-16 w-48 h-48 rounded-full opacity-20 blur-2xl anim-float"
          style={{ background: darkMode ? "#2DD4BF" : "#ffffff" }} />
        <div className="absolute bottom-32 left-12 w-32 h-32 rounded-full opacity-15 blur-2xl anim-float"
          style={{ animationDelay: "1.5s", background: darkMode ? "#DDA448" : "#ffffff" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <FaChartLine size={22} className="text-white/90" />
            <span className="font-display text-xl font-black text-white/90">FinTrack</span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="font-display text-5xl font-black text-white leading-tight mb-6">
            Your wealth,<br />
            <span className="text-white/70">your story.</span>
          </p>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Track every rupee. Watch every stock. Own every decision.
            FinTrack gives you the clarity to invest with confidence.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          {["Live stock prices from Finnhub", "AI-powered expense insights", "Multi-currency portfolio"].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
              <span className="text-white/60 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
            <FaChartLine size={20} className="text-lightAccent dark:text-darkAccent" />
            <span className="font-display text-xl font-black text-lightAccent dark:text-darkAccent">FinTrack</span>
          </div>

          {/* Heading */}
          <div className="mb-8 anim-slide-in">
            <h2 className="font-display text-3xl font-black text-lightText dark:text-darkText mb-2">
              {isLogin ? "Welcome back." : "Create account."}
            </h2>
            <p className="text-sm text-lightMuted dark:text-gray-400">
              {isLogin ? "Sign in to your FinTrack account" : "Start your financial journey today"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20
              border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm
              anim-fade-up">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="anim-fade-up anim-delay-1">
                <label className="block text-xs font-medium mb-1.5 text-lightMuted dark:text-gray-400">
                  Full Name
                </label>
                <input type="text" name="name" placeholder="Yathaartha Srivastava"
                  className={inputClass} onChange={handleChange} required />
              </div>
            )}

            <div className="anim-fade-up anim-delay-2">
              <label className="block text-xs font-medium mb-1.5 text-lightMuted dark:text-gray-400">
                Email address
              </label>
              <input type="email" name="email" placeholder="you@example.com"
                className={inputClass} onChange={handleChange} required />
            </div>

            <div className="anim-fade-up anim-delay-3">
              <label className="block text-xs font-medium mb-1.5 text-lightMuted dark:text-gray-400">
                Password
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder={isLogin ? "Your password" : "Min 8 characters"}
                  className={inputClass + " pr-11"}
                  onChange={handleChange} required />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-lightAccent dark:hover:text-darkAccent transition">
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>

              {/* Password strength bar — only on signup */}
              {!isLogin && formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${i <= strength.score ? strength.color : "bg-gray-200 dark:bg-darkBorder"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-lightMuted dark:text-gray-500">
                    Strength: <span className={`font-semibold ${
                      strength.score <= 1 ? "text-red-500" :
                      strength.score <= 2 ? "text-orange-400" :
                      strength.score <= 3 ? "text-yellow-500" :
                      "text-green-500"
                    }`}>{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="anim-fade-up anim-delay-4 pt-1">
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm
                bg-lightAccent dark:bg-darkAccent
                text-white dark:text-black
                hover:scale-[1.02] hover:shadow-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white
                      rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="anim-fade-up anim-delay-5 my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-darkBorder" />
            <span className="text-xs text-lightMuted dark:text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-darkBorder" />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="anim-fade-up anim-delay-5 w-full flex items-center justify-center gap-3
            py-3 rounded-xl border text-sm font-medium
            border-gray-300 dark:border-darkBorder
            bg-white dark:bg-darkCard
            text-lightText dark:text-darkText
            hover:bg-gray-50 dark:hover:bg-darkBg
            hover:scale-[1.01] transition-all duration-200
            disabled:opacity-50">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="text-center mt-6 text-sm text-lightMuted dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have one?"}
            <span onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="ml-1 cursor-pointer font-semibold
              text-lightAccent dark:text-darkAccent hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}