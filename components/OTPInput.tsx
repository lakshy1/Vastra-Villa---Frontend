"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  onVerify: (otp: string) => void;
  isVerified: boolean;
}

export default function OTPInput({ onVerify, isVerified }: OTPInputProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "");
    if (!digit) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  // Auto submit when filled
  useEffect(() => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 4) {
      onVerify(fullOtp);
    }
  }, [otp, onVerify]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center gap-2"
    >
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`w-12 h-12 text-center text-lg rounded-xl
          bg-white/40 backdrop-blur-md
          border 
          ${
            isVerified
              ? "border-champagne"
              : "border-softSilk focus:ring-2 focus:ring-champagne"
          }
          outline-none transition-all text-obsidian`}
        />
      ))}
    </motion.div>
  );
}