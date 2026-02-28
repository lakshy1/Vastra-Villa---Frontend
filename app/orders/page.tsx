"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PackageSearch } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuth();

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
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center justify-center">
            <PackageSearch size={22} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">My Orders</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Track your placed orders and delivery updates here.</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border-soft)] p-8 text-center bg-[var(--bg-card)]">
          <p className="text-[var(--text-primary)] font-medium">No orders yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Once you place an order, realtime order statuses will appear on this page.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
