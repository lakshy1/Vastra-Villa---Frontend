"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import PasswordStrength from "@/components/PasswordStrength";
import { sendOtp, verifyOtp, registerUser } from "@/services/authService";

export default function SignupPage() {
  const router = useRouter();

  /* ─── states ─────────────────────────────────── */
  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [password, setPassword]         = useState("");
  const [otpSent, setOtpSent]           = useState(false);
  const [emailOtp, setEmailOtp]         = useState(["", "", "", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown]         = useState(0);
  const [loading, setLoading]           = useState(false);
  const [otpLoading, setOtpLoading]     = useState(false);

  const isValidPhone = phone.length === 10;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* ─── countdown timer ────────────────────────── */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /* ─── SEND OTP ───────────────────────────────── */
  const handleSendOTP = async () => {
    if (!isValidEmail) {
      toast.error("Enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
      setCooldown(120);
      setIsOtpVerified(false);
      setEmailOtp(["", "", "", "", "", ""]);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  /* ─── VERIFY OTP ─────────────────────────────── */
  const handleVerifyOtp = useCallback(
    async (enteredOtp) => {
      if (isOtpVerified || isVerifyingOtp) return;

      setIsVerifyingOtp(true);
      try {
        await verifyOtp(email, enteredOtp);
        setIsOtpVerified(true);
        toast.success("Email verified successfully ✅");
      } catch (error) {
        toast.error(error.response?.data?.message || "Invalid OTP");
        setEmailOtp(["", "", "", "", "", ""]); // clear otp boxes on wrong
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [email, isOtpVerified, isVerifyingOtp]
  );

  /* ─── REGISTER ───────────────────────────────── */
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

      // save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Account created successfully ✨");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-alabaster flex items-center justify-center px-4">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-10 rounded-3xl backdrop-blur-2xl bg-white/30 border border-softSilk shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-obsidian text-center mb-8">
          Create Your Vastra Villa Account
        </h2>

        <div className="space-y-6">

          {/* FIRST + LAST NAME */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="w-1/2">
              <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          {/* EMAIL + SEND OTP BUTTON */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);         // reset if email changes
                  setIsOtpVerified(false);
                }}
              />
            </div>
            <button
              disabled={!isValidEmail || cooldown > 0 || otpLoading}
              onClick={handleSendOTP}
              className="px-4 py-3 rounded-xl min-w-[120px]
              bg-obsidian text-alabaster hover:bg-champagne hover:text-obsidian
              disabled:bg-softSilk disabled:text-obsidian/40 transition-all"
            >
              {otpLoading
                ? "Sending..."
                : cooldown > 0
                ? `Resend ${formatTime(cooldown)}`
                : "Send OTP"}
            </button>
          </div>

          {/* OTP BOXES — shows after OTP sent */}
          {otpSent && (
            <EmailOTP
              emailOtp={emailOtp}
              setEmailOtp={setEmailOtp}
              onVerify={handleVerifyOtp}
              isVerified={isOtpVerified}
              isVerifying={isVerifyingOtp}
            />
          )}

          {/* PHONE */}
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />

          {/* PASSWORD */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />

          {/* REGISTER BUTTON */}
          <motion.button
            disabled={!isFormValid || loading}
            onClick={handleSubmit}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-medium
            bg-obsidian text-alabaster hover:bg-champagne hover:text-obsidian
            disabled:bg-softSilk disabled:text-obsidian/40 transition-all"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}

/* ─── FLOATING LABEL INPUT ───────────────────────────────── */
function Input({ label, type = "text", value, onChange }) {
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
        text-obsidian"
      />
      <label
        htmlFor={inputId}
        className="absolute left-4 top-2 text-sm text-obsidian/60
        transition-all duration-200 cursor-text
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
        peer-focus:top-2 peer-focus:text-sm peer-focus:text-deepRoseGold"
      >
        {label}
      </label>
    </div>
  );
}

/* ─── EMAIL OTP BOXES ────────────────────────────────────── */
function EmailOTP({ emailOtp, setEmailOtp, onVerify, isVerified, isVerifying }) {
  const inputsRef = useRef([]);
  const hasSubmittedRef = useRef(false);

  // reset submitted ref when otp clears
  useEffect(() => {
    if (emailOtp.every((d) => d === "")) {
      hasSubmittedRef.current = false;
    }
  }, [emailOtp]);

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, "");
    if (!digit) return;
    const newOtp = [...emailOtp];
    newOtp[index] = digit;
    setEmailOtp(newOtp);
    if (index < emailOtp.length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
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
      <p className="text-sm text-obsidian/60 text-center mb-3">
        {isVerified ? "✅ Email Verified" : isVerifying ? "Verifying..." : "Enter OTP sent to your email"}
      </p>
      <div className="flex justify-center gap-2">
        {emailOtp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isVerified}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`w-12 h-12 text-center rounded-xl bg-white/40 border
            ${isVerified
              ? "border-champagne bg-champagne/10"
              : "border-softSilk focus:ring-2 focus:ring-champagne"
            } outline-none transition-all text-obsidian`}
          />
        ))}
      </div>
    </div>
  );
}