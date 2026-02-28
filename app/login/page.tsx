"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  /* =========================
     STATE MANAGEMENT
  ========================== */
  const [identifier, setIdentifier] = useState(""); // email OR phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     VALIDATION HELPERS
     - Detect if identifier is valid email or phone
  ========================== */
  const validateIdentifier = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(value)) return "email";
    if (phoneRegex.test(value)) return "phone";
    return null;
  };

  const identifierType = validateIdentifier(identifier);

  const isFormValid = identifierType !== null && password.trim().length > 0;

  /* =========================
     LOGIN FUNCTION
     🔥 Replace MOCK section with backend API
  ========================== */
  const handleLogin = async () => {
    // STEP 1: Frontend format validation
    if (!identifierType) {
      toast.error("Enter valid Email or 10 digit Phone Number", {
        style: { background: "#1A1A1A", color: "#F9F7F1" },
      });
      return;
    }

    if (!password.trim()) {
      toast.error("Password cannot be empty", {
        style: { background: "#1A1A1A", color: "#F9F7F1" },
      });
      return;
    }

    setLoading(true);

    try {
      /* ================================================
         🔥 BACKEND INTEGRATION STARTS HERE

         Replace MOCK section with:

         const res = await fetch("/api/login", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             identifier,
             password,
           }),
         });

         const data = await res.json();

         if (!res.ok || !data.success) {
           throw new Error(data.message || "Invalid credentials");
         }

         // On success:
         // 1. Store token in cookie or localStorage
         // 2. Redirect to dashboard
      ================================================= */

      // ================= MOCK LOGIN =================
      const mockEmail = "test@example.com";
      const mockPhone = "9876543210";
      const mockPassword = "123456";

      if (
        (identifier === mockEmail || identifier === mockPhone) &&
        password === mockPassword
      ) {
        // SUCCESS CASE
        toast.success("Login Successful ✨", {
          style: { background: "#1A1A1A", color: "#F9F7F1" },
        });

        setTimeout(() => {
          // Use replace to prevent going back to login
          router.replace("/dashboard");
        }, 800);
      } else {
        // FAILURE CASE
        toast.error("Invalid Email/Phone or Password", {
          style: { background: "#1A1A1A", color: "#F9F7F1" },
        });
      }
      // =================================================
    } catch (error: any) {
      /* =============================================
         🔥 BACKEND FAILURE CASE
         This runs if:
         - Server crashes
         - Network error
         - Invalid credentials thrown
      ============================================== */
      toast.error(error.message || "Login Failed", {
        style: { background: "#1A1A1A", color: "#F9F7F1" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alabaster flex items-center justify-center px-4">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/30 border border-softSilk shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-obsidian text-center mb-8">
          Welcome Back to Vastra Villa
        </h2>

        <div className="space-y-6">
          {/* EMAIL OR PHONE INPUT */}
          <FloatingInput
            label="Email or Phone Number"
            value={identifier}
            onChange={(e: any) => setIdentifier(e.target.value)}
          />

          {/* PASSWORD WITH ANIMATED EYE */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {/* REGISTER OPTION */}
          <div className="text-sm text-center text-[var(--text-secondary)]">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] cursor-pointer transition"
            >
              Create one
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <motion.button
            whileHover={{ scale: isFormValid ? 1.03 : 1 }}
            whileTap={{ scale: isFormValid ? 0.97 : 1 }}
            disabled={!isFormValid || loading}
            onClick={handleLogin}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300
            ${
              isFormValid
                ? "bg-obsidian text-alabaster hover:bg-champagne hover:text-obsidian"
                : "bg-softSilk text-obsidian/40 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= FLOATING INPUT ================= */

function FloatingInput({ label, type = "text", value, onChange }: any) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="relative">
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full px-4 pt-6 pb-2 rounded-xl
        bg-white/40 backdrop-blur-md border border-softSilk
        focus:outline-none focus:ring-2 focus:ring-deepRoseGold
        transition-all text-obsidian"
      />

      <label
        htmlFor={inputId}
        className="absolute left-4 top-2 text-sm text-obsidian/60
        transition-all duration-200 cursor-text
        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-base
        peer-focus:top-2
        peer-focus:text-sm
        peer-focus:text-deepRoseGold"
      >
        {label}
      </label>
    </div>
  );
}

/* ================= PASSWORD INPUT WITH ANIMATED EYE ================= */

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
}: any) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="relative">
      <input
        id={inputId}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full px-4 pt-6 pb-2 pr-12 rounded-xl
        bg-white/40 backdrop-blur-md border border-softSilk
        focus:outline-none focus:ring-2 focus:ring-deepRoseGold
        transition-all text-obsidian"
      />

      <label
        htmlFor={inputId}
        className="absolute left-4 top-2 text-sm text-obsidian/60
        transition-all duration-200 cursor-text
        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-base
        peer-focus:top-2
        peer-focus:text-sm
        peer-focus:text-deepRoseGold"
      >
        {label}
      </label>

      {/* Animated Eye Toggle */}
      <motion.button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        whileTap={{ scale: 0.85 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian/60 hover:text-champagne transition-colors"
      >
        <AnimatePresence mode="wait">
          {showPassword ? (
            <motion.div
              key="eyeOff"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EyeOff size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="eye"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Eye size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
