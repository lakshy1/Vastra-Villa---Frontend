"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-12 rounded-3xl
        bg-[var(--bg-card)]
        border border-[var(--border-soft)]
        shadow-xl text-center"
      >
        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full 
          bg-[var(--bg-main)]
          flex items-center justify-center
          border border-[var(--border-soft)]">
            <ShoppingBag
              size={32}
              className="text-[var(--accent-primary)]"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Your Cart is Empty
        </h2>

        {/* SUBTEXT */}
        <p className="mt-3 text-sm text-[#4F4F4F] leading-relaxed">
          Looks like you haven’t added anything yet.  
          Explore our latest collections and discover timeless elegance.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

          {/* SHOP BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="px-8 py-3 rounded-xl
            bg-[#1A1A1A] text-white font-medium
            hover:bg-[var(--accent-primary)]
            transition-all duration-300"
          >
            Go Shopping
          </motion.button>

          {/* DASHBOARD BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 rounded-xl
            border border-[var(--border-soft)]
            text-[var(--text-primary)]
            hover:bg-[var(--bg-main)]
            transition-all duration-300"
          >
            Go to Dashboard
          </motion.button>

        </div>

      </motion.div>

    </div>
  );
}