"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isHydrated, initials } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return <div className="min-h-screen bg-alabaster" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-28 px-4 md:px-8 pb-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl mx-auto rounded-3xl border border-[var(--border-soft)] bg-white/40 backdrop-blur-xl shadow-xl p-8 md:p-10"
      >
        <div className="flex items-center gap-5 mb-8">
          <div className="h-16 w-16 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-xl font-semibold">
            {initials}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">My Profile</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Your account details synced from backend login data</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Name</p>
            <p className="text-[var(--text-primary)] font-medium mt-1">{user.name}</p>
          </div>

          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Email</p>
            <p className="text-[var(--text-primary)] font-medium mt-1">{user.email}</p>
          </div>

          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Phone</p>
            <p className="text-[var(--text-primary)] font-medium mt-1">{user.phone || "Not added"}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
