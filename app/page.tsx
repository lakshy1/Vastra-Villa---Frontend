"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/assets/Vastra-Villa-Logo.png";
import Dashboard from "./dashboard/page";

export default function HomePage() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-[var(--bg-main)]/95 backdrop-blur-xl flex items-center justify-center"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 2.4 }}
                className="absolute h-40 w-40 rounded-full border border-[var(--accent-primary)]/35"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 3.2 }}
                className="absolute h-28 w-28 rounded-full border border-[var(--accent-hover)]/35"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="relative h-20 w-20 rounded-2xl bg-white/60 border border-white/80 shadow-xl p-3"
              >
                <Image src={Logo} alt="Vastra Villa Loading Logo" fill className="object-contain p-3" priority />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 text-sm tracking-[0.22em] uppercase text-[var(--accent-primary)]"
              >
                Vastra Villa
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dashboard />
    </>
  );
}
