"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import PasswordStrength from "@/components/PasswordStrength";

export default function SignupPage() {
  const router = useRouter();

  /* ================= FORM STATES ================= */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState(["", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const isValidPhone = phone.length === 10;
  const isValidEmail = email.includes("@");

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /* ================= SEND EMAIL OTP ================= */
  const handleSendOTP = async () => {
    if (!isValidEmail) {
      toast.error("Enter valid email address", {
        style: { background: "#1A1A1A", color: "#F9F7F1" },
      });
      return;
    }

    /*
      🔥 BACKEND:
      await fetch("/api/send-email-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    */

    setOtpSent(true);
    setCooldown(120);
    setIsOtpVerified(false);

    toast.success("OTP sent to email", {
      style: { background: "#1A1A1A", color: "#F9F7F1" },
    });
  };

  /* ================= VERIFY OTP ================= */
  const verifyOTP = useCallback(
    (enteredOtp: string) => {
      if (isOtpVerified || isVerifyingOtp) return;

      setIsVerifyingOtp(true);

      /*
        🔥 BACKEND VERIFY:
        await fetch("/api/verify-email-otp", {...})
      */

      if (enteredOtp === "1234") {
        setIsOtpVerified(true);
        toast.success("Email Verified Successfully", {
          style: { background: "#1A1A1A", color: "#F9F7F1" },
        });
      } else {
        toast.error("Invalid OTP", {
          style: { background: "#1A1A1A", color: "#F9F7F1" },
        });
      }

      setIsVerifyingOtp(false);
    },
    [isOtpVerified, isVerifyingOtp]
  );

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    isValidEmail &&
    isOtpVerified &&
    isValidPhone &&
    password.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);

    /*
      🔥 BACKEND SIGNUP:
      await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
        }),
      });
    */

    setTimeout(() => {
      setLoading(false);
      toast.success("Account Created Successfully ✨", {
        style: { background: "#1A1A1A", color: "#F9F7F1" },
      });

      router.replace("/dashboard");
    }, 1000);
  };

  const formatTime = (seconds: number) => {
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

          {/* FIRST + LAST */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <Input label="First Name" value={firstName} onChange={(e:any)=>setFirstName(e.target.value)} />
            </div>
            <div className="w-1/2">
              <Input label="Last Name" value={lastName} onChange={(e:any)=>setLastName(e.target.value)} />
            </div>
          </div>

          {/* EMAIL + OTP BUTTON */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input label="Email Address" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
            </div>

            <button
              disabled={!isValidEmail || cooldown > 0}
              onClick={handleSendOTP}
              className="px-4 py-3 rounded-xl min-w-[120px]
              bg-obsidian text-alabaster hover:bg-champagne hover:text-obsidian
              disabled:bg-softSilk disabled:text-obsidian/40"
            >
              {cooldown > 0
                ? `Resend ${formatTime(cooldown)}`
                : "Send OTP"}
            </button>
          </div>

          {/* OTP BOXES */}
          {otpSent && (
            <EmailOTP
              emailOtp={emailOtp}
              setEmailOtp={setEmailOtp}
              onVerify={verifyOTP}
              isVerified={isOtpVerified}
            />
          )}

          {/* PHONE */}
          <Input label="Phone Number" value={phone} onChange={(e:any)=>setPhone(e.target.value.replace(/\D/g,""))} />

          {/* PASSWORD */}
          <Input label="Password" type="password" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
          <PasswordStrength password={password} />

          {/* CREATE BUTTON */}
          <motion.button
            disabled={!isFormValid || loading}
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-medium
            bg-obsidian text-alabaster hover:bg-champagne hover:text-obsidian
            disabled:bg-softSilk disabled:text-obsidian/40"
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}

/* ================= FLOATING INPUT ================= */
function Input({ label, type="text", value, onChange }: any){
  const inputId = label.replace(/\s+/g, "-").toLowerCase();
  return(
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
  )
}

/* ================= EMAIL OTP ================= */
function EmailOTP({ emailOtp, setEmailOtp, onVerify, isVerified }: any){
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const hasSubmittedRef = useRef(false);

  const handleChange=(value:string,index:number)=>{
    const digit=value.replace(/\D/g,"");
    if(!digit) return;

    const newOtp=[...emailOtp];
    newOtp[index]=digit;
    setEmailOtp(newOtp);

    if(index<3) inputsRef.current[index+1]?.focus();
  };

  useEffect(()=>{
    const fullOtp=emailOtp.join("");
    if(fullOtp.length===4 && !hasSubmittedRef.current){
      hasSubmittedRef.current=true;
      onVerify(fullOtp);
    }
  },[emailOtp,onVerify]);

  return(
    <div className="flex justify-center gap-2">
      {emailOtp.map((digit:any,i:number)=>(
        <input
          key={i}
          ref={(el)=>inputsRef.current[i]=el}
          maxLength={1}
          value={digit}
          onChange={(e)=>handleChange(e.target.value,i)}
          className={`w-12 h-12 text-center rounded-xl
          bg-white/40 border
          ${
            isVerified
              ? "border-champagne"
              : "border-softSilk focus:ring-2 focus:ring-champagne"
          }`}
        />
      ))}
    </div>
  );
}