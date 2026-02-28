"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, UserRound, Package, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../assets/Vastra-Villa-Logo.png";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initials, isHydrated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHomeLoading, setIsHomeLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { title: "Unstitched Suit", desc: "Classic & Festive Collection" },
    { title: "Kurti Tops", desc: "Modern Everyday Elegance" },
    { title: "Sarees", desc: "Timeless Traditional Drapes" },
    { title: "Night Wear", desc: "Comfort Meets Style" },
    { title: "Inner Wear", desc: "Essential Basics" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isHomeLoading || pathname !== "/dashboard") return;

    loadingTimerRef.current = setTimeout(() => {
      setIsHomeLoading(false);
    }, 700);
  }, [pathname, isHomeLoading]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    toast.success("Logged out successfully");
    router.replace("/");
  };

  const goTo = (path: string) => {
    setIsProfileOpen(false);
    router.push(path);
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsHomeLoading(true);

    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);

    if (pathname === "/dashboard") {
      loadingTimerRef.current = setTimeout(() => {
        setIsHomeLoading(false);
      }, 900);
      return;
    }

    loadingTimerRef.current = setTimeout(() => {
      router.push("/dashboard");
    }, 420);
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence>
        {isHomeLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-[var(--bg-main)]/95 backdrop-blur-xl flex items-center justify-center"
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

      <nav className="fixed top-0 w-full z-50 bg-[var(--bg-main)] border-b border-[var(--border-soft)] backdrop-blur-lg">
        <div className="relative w-full h-16 md:h-20 px-4 md:px-6 flex items-center">
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition"
            >
              <Menu size={24} />
            </motion.button>
          </div>

          <button
            type="button"
            onClick={handleHomeClick}
            className="flex items-center gap-3 mx-auto md:absolute md:left-1/2 md:-translate-x-1/2 cursor-pointer"
            aria-label="Go to dashboard"
          >
            <div className="relative w-9 h-9 md:w-12 md:h-12">
              <Image src={Logo} alt="Vastra Villa Logo" fill className="object-contain" priority />
            </div>

            <div className="leading-tight text-left">
              <h1 className="text-lg md:text-2xl font-semibold tracking-wide text-[var(--text-primary)]">
                Vastra Villa
              </h1>
              <p className="hidden md:block text-[10px] tracking-[3px] uppercase text-[var(--accent-primary)] mt-1">
                Premium Ethnic Wear
              </p>
            </div>
          </button>

          <div className="flex items-center gap-4 ml-auto md:absolute md:right-6 md:ml-0">
            <ShoppingBag
              size={20}
              onClick={() => router.push("/cart")}
              className="text-[var(--text-primary)] hover:text-[var(--accent-hover)] cursor-pointer transition"
            />

            {isHydrated && !user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm md:text-base rounded-xl bg-[#1A1A1A] text-white hover:bg-[var(--accent-primary)] transition-all duration-300"
              >
                Login
              </motion.button>
            ) : null}

            {isHydrated && user ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-semibold hover:bg-[var(--accent-primary)] transition-all cursor-pointer"
                >
                  {initials}
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-64 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-[var(--border-soft)] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center font-semibold text-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => goTo("/profile")}
                        className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition flex items-center gap-2"
                      >
                        <UserRound size={16} />
                        My Profile
                      </button>

                      <button
                        onClick={() => goTo("/orders")}
                        className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition flex items-center gap-2"
                      >
                        <Package size={16} />
                        My Orders
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-[#A33A3A] hover:bg-[#FDECEC] transition flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1A1A1A] z-40 backdrop-blur-sm"
            />

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

              <div className="flex flex-col gap-8">
                {categories.map((item, index) => (
                  <motion.div key={index} whileHover={{ x: 8 }} className="group cursor-pointer">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#4F4F4F] mt-1 leading-relaxed">{item.desc}</p>
                    <div className="h-px bg-[var(--border-soft)] mt-4"></div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-12">
                <p className="text-sm text-[var(--accent-primary)]">Festive Collection 2026</p>
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
