"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../assets/Vastra-Villa-Logo.png";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<null | { first: string; last: string }>(
    null,
  );

  const categories = [
    { title: "Unstitched Suit", desc: "Classic & Festive Collection" },
    { title: "Kurti Tops", desc: "Modern Everyday Elegance" },
    { title: "Sarees", desc: "Timeless Traditional Drapes" },
    { title: "Night Wear", desc: "Comfort Meets Style" },
    { title: "Inner Wear", desc: "Essential Basics" },
  ];

  const getInitials = () =>
    user ? `${user.first[0]}${user.last[0]}`.toUpperCase() : "";

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--bg-main)] border-b border-[var(--border-soft)] backdrop-blur-lg">
        {/* Wrapper */}
        <div className="relative w-full h-16 md:h-20 px-4 md:px-6 flex items-center">
          {/* LEFT */}
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition"
            >
              <Menu size={24} />
            </motion.button>
          </div>

          {/* CENTER */}
          <div
            className="
      flex items-center gap-3 mx-auto
      md:absolute md:left-1/2 md:-translate-x-1/2
    "
          >
            <div className="relative w-9 h-9 md:w-12 md:h-12">
              <Image
                src={Logo}
                alt="Vastra Villa Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="leading-tight text-left">
              <h1 className="text-lg md:text-2xl font-semibold tracking-wide text-[var(--text-primary)]">
                Vastra Villa
              </h1>
              <p className="hidden md:block text-[10px] tracking-[3px] uppercase text-[var(--accent-primary)] mt-1">
                Premium Ethnic Wear
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 ml-auto md:absolute md:right-6 md:ml-0">
            <ShoppingBag
              size={20}
              onClick={() => router.push("/cart")}
              className="text-[var(--text-primary)] hover:text-[var(--accent-hover)] cursor-pointer transition"
            />

            {!user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm md:text-base rounded-xl bg-[#1A1A1A] text-white hover:bg-[var(--accent-primary)] transition-all duration-300"
              >
                Login
              </motion.button>
            ) : (
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-semibold hover:bg-[var(--accent-primary)] transition-all cursor-pointer">
                {getInitials()}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SIDEBAR + OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1A1A1A] z-40 backdrop-blur-sm"
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: -350 }}
              animate={{ x: 0 }}
              exit={{ x: -350 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[340px]
              bg-[var(--bg-main)]
              border-r border-[var(--border-soft)]
              shadow-2xl z-50 p-10 flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Discover Collection
                  </h2>
                  <div className="w-12 h-[2px] bg-[var(--accent-primary)] mt-2"></div>
                </div>
                <X
                  size={22}
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition"
                />
              </div>

              {/* CATEGORY LIST */}
              <div className="flex flex-col gap-8">
                {categories.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 8 }}
                    className="group cursor-pointer"
                  >
                    <h3 className="text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#4F4F4F] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="h-px bg-[var(--border-soft)] mt-4"></div>
                  </motion.div>
                ))}
              </div>

              {/* FOOTER AREA */}
              <div className="mt-auto pt-12">
                <p className="text-sm text-[var(--accent-primary)]">
                  Festive Collection 2026
                </p>
                <p className="text-sm text-[#4F4F4F] mt-1 leading-relaxed">
                  Explore handcrafted pieces curated for every celebration.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
