"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, Sparkles, Zap } from "lucide-react";
import axios from "axios";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message || fallback;
  }
  return fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const { user, isHydrated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHydrated && user) router.replace("/dashboard");
  }, [isHydrated, user, router]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isValidEmail && password.trim().length > 0;

  const handleLogin = async () => {
    if (!isValidEmail) return toast.error("Enter a valid email address");
    if (!password.trim()) return toast.error("Password cannot be empty");

    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      login(data.user);
      toast.success("Login successful");
      router.replace("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)] px-4 py-10 md:py-14">
      <Toaster position="top-right" />
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/50 bg-white/35 shadow-[0_30px_120px_-40px_rgba(26,26,26,0.65)] backdrop-blur-2xl md:grid-cols-[1.1fr_0.9fr]"
      >
        <ShowcasePanel title="Return to Curated Elegance" subtitle="Secure sign-in crafted with premium speed and privacy." />

        <div className="border-t border-white/40 p-7 md:border-l md:border-t-0 md:p-10 lg:p-12">
          <p className="inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            Member Login
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Use your verified account to continue.</p>

          <div className="mt-8 space-y-5">
            <GlassInput label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <motion.button
              whileHover={{ scale: isFormValid ? 1.01 : 1 }}
              whileTap={{ scale: isFormValid ? 0.985 : 1 }}
              disabled={!isFormValid || loading}
              onClick={handleLogin}
              className={`w-full rounded-xl py-3 font-medium transition-all duration-300 ${
                isFormValid
                  ? "bg-obsidian text-alabaster shadow-[0_15px_35px_-18px_rgba(26,26,26,0.95)] hover:bg-champagne hover:text-obsidian"
                  : "cursor-not-allowed bg-softSilk text-obsidian/40"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            <p className="text-center text-sm text-[var(--text-secondary)]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="font-medium text-[var(--accent-primary)] transition hover:text-[var(--accent-hover)]"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        animate={{ x: [0, 24, 0], y: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 top-6 h-80 w-80 rounded-full bg-[var(--accent-primary)]/24 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -18, 0], y: [0, 16, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[var(--accent-hover)]/18 blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.55),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.38),transparent_48%,rgba(184,142,141,0.1))]" />
    </div>
  );
}

function ShowcasePanel({ title, subtitle }: { title: string; subtitle: string }) {
  const features = [
    { icon: ShieldCheck, label: "Bank-grade protection" },
    { icon: Zap, label: "Instant secure access" },
    { icon: Sparkles, label: "Premium shopping flow" },
  ];

  return (
    <div className="relative hidden overflow-hidden p-10 md:block lg:p-12">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.36),rgba(255,255,255,0.06))]" />
      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">Vastra Villa</p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[var(--text-primary)]">{title}</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">{subtitle}</p>

        <div className="mt-10 space-y-4">
          {features.map(({ icon: Icon, label }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/55 px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

type GlassInputProps = {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function GlassInput({ label, type = "text", value, onChange }: GlassInputProps) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="relative">
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full rounded-xl border border-white/70 bg-white/70 px-4 pb-2 pt-6 text-obsidian shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-all focus:outline-none focus:ring-2 focus:ring-deepRoseGold/80"
      />
      <label
        htmlFor={inputId}
        className="absolute left-4 top-2 cursor-text text-sm text-obsidian/60 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-deepRoseGold"
      >
        {label}
      </label>
    </div>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

function PasswordInput({ label, value, onChange, showPassword, setShowPassword }: PasswordInputProps) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="relative">
      <input
        id={inputId}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full rounded-xl border border-white/70 bg-white/70 px-4 pb-2 pt-6 pr-12 text-obsidian shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-all focus:outline-none focus:ring-2 focus:ring-deepRoseGold/80"
      />
      <label
        htmlFor={inputId}
        className="absolute left-4 top-2 cursor-text text-sm text-obsidian/60 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-deepRoseGold"
      >
        {label}
      </label>

      <motion.button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        whileTap={{ scale: 0.88 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian/60 transition-colors hover:text-champagne"
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
