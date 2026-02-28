"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import PasswordStrength from "@/components/PasswordStrength";
import { sendOtp, verifyOtp, registerUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message || fallback;
  }
  return fallback;
}

export default function SignupPage() {
  const router = useRouter();
  const { user, isHydrated, login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const isValidPhone = phone.length === 10;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (isHydrated && user) router.replace("/dashboard");
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOTP = async () => {
    if (!isValidEmail) return toast.error("Enter a valid email address");

    setOtpLoading(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
      setCooldown(120);
      setIsOtpVerified(false);
      setEmailOtp(["", "", "", "", "", ""]);
      toast.success("OTP sent to your email");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to send OTP"));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(
    async (enteredOtp: string) => {
      if (isOtpVerified || isVerifyingOtp) return;

      setIsVerifyingOtp(true);
      try {
        await verifyOtp(email, enteredOtp);
        setIsOtpVerified(true);
        toast.success("Email verified successfully");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Invalid OTP"));
        setEmailOtp(["", "", "", "", "", ""]);
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [email, isOtpVerified, isVerifyingOtp],
  );

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    isValidEmail &&
    isOtpVerified &&
    isValidPhone &&
    password.length >= 6;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const { data } = await registerUser({
        name: `${firstName} ${lastName}`,
        phone,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      login(data.user);

      toast.success("Account created successfully");
      router.replace("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)] px-4 py-8 md:py-12">
      <Toaster position="top-right" />
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/50 bg-white/35 shadow-[0_30px_120px_-40px_rgba(26,26,26,0.65)] backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr]"
      >
        <ShowcasePanel />

        <div className="border-t border-white/40 p-7 md:border-l md:border-t-0 md:p-10 lg:p-12">
          <p className="inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            Create Profile
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">Start Shopping Premium</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Verify your email and create your account in seconds.</p>

          <div className="mt-7 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <GlassInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <GlassInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <GlassInput
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                  setIsOtpVerified(false);
                }}
              />
              <button
                disabled={!isValidEmail || cooldown > 0 || otpLoading}
                onClick={handleSendOTP}
                className="h-[50px] min-w-[132px] rounded-xl bg-obsidian px-4 text-alabaster transition-all hover:bg-champagne hover:text-obsidian disabled:bg-softSilk disabled:text-obsidian/40"
              >
                {otpLoading ? "Sending..." : cooldown > 0 ? `Resend ${formatTime(cooldown)}` : "Send OTP"}
              </button>
            </div>

            {otpSent && (
              <div className="rounded-xl border border-white/70 bg-white/58 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <EmailOTP
                  emailOtp={emailOtp}
                  setEmailOtp={setEmailOtp}
                  onVerify={handleVerifyOtp}
                  isVerified={isOtpVerified}
                  isVerifying={isVerifyingOtp}
                />
              </div>
            )}

            <GlassInput
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />

            <GlassInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <PasswordStrength password={password} />

            <motion.button
              disabled={!isFormValid || loading}
              onClick={handleSubmit}
              whileTap={{ scale: 0.985 }}
              whileHover={{ scale: isFormValid ? 1.01 : 1 }}
              className="w-full rounded-xl bg-obsidian py-3 font-medium text-alabaster transition-all hover:bg-champagne hover:text-obsidian disabled:bg-softSilk disabled:text-obsidian/40"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>

            <p className="text-center text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-medium text-[var(--accent-primary)] transition hover:text-[var(--accent-hover)]"
              >
                Login
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
        animate={{ x: [0, 20, 0], y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-[var(--accent-primary)]/24 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[var(--accent-hover)]/18 blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.55),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.38),transparent_50%,rgba(184,142,141,0.1))]" />
    </div>
  );
}

function ShowcasePanel() {
  const bullets = [
    { icon: ShieldCheck, label: "Verified signup with OTP security" },
    { icon: Sparkles, label: "Luxury-first personalized feed" },
    { icon: WandSparkles, label: "Smooth, fast onboarding" },
  ];

  return (
    <div className="relative hidden overflow-hidden p-10 md:block lg:p-12">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.36),rgba(255,255,255,0.06))]" />
      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">Vastra Villa</p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[var(--text-primary)]">Premium style begins with a premium account.</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          Build your profile once and unlock seamless checkout, order tracking, and personalized selections.
        </p>

        <div className="mt-10 space-y-4">
          {bullets.map(({ icon: Icon, label }, idx) => (
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
  type?: string;
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

type EmailOtpProps = {
  emailOtp: string[];
  setEmailOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onVerify: (otp: string) => void;
  isVerified: boolean;
  isVerifying: boolean;
};

function EmailOTP({ emailOtp, setEmailOtp, onVerify, isVerified, isVerifying }: EmailOtpProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (emailOtp.every((d) => d === "")) hasSubmittedRef.current = false;
  }, [emailOtp]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "");
    if (!digit) return;
    const newOtp = [...emailOtp];
    newOtp[index] = digit;
    setEmailOtp(newOtp);
    if (index < emailOtp.length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...emailOtp];
      newOtp[index] = "";
      setEmailOtp(newOtp);
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const fullOtp = emailOtp.join("");
    if (fullOtp.length === emailOtp.length && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      onVerify(fullOtp);
    }
  }, [emailOtp, onVerify]);

  return (
    <div>
      <p className="mb-3 text-center text-sm text-obsidian/70">
        {isVerified ? "Email Verified" : isVerifying ? "Verifying..." : "Enter OTP sent to your email"}
      </p>
      <div className="flex justify-center gap-2">
        {emailOtp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isVerified}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`h-11 w-11 rounded-xl border bg-white/80 text-center text-obsidian outline-none transition-all ${
              isVerified ? "border-champagne bg-champagne/10" : "border-white/80 focus:ring-2 focus:ring-champagne/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
