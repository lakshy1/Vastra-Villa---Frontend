"use client";

import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-[var(--border-soft)] bg-[var(--bg-main)] transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0">

        {/* BRAND COLUMN */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-wide text-[var(--text-primary)]">
            Vastra Villa
          </h2>

          <p className="text-sm leading-relaxed text-[var(--text-primary)] opacity-70">
            Celebrating timeless elegance with premium ethnic wear crafted
            for modern women. Discover tradition blended with contemporary grace.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 pt-4">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <Icon
                key={index}
                size={20}
                className="cursor-pointer text-[var(--text-primary)] opacity-70 hover:text-[var(--accent-hover)] transition-colors"
              />
            ))}
          </div>
        </div>

        {/* SHOP LINKS */}
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-[var(--accent-primary)] mb-6">
            SHOP
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-primary)] opacity-80">
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Unstitched Suit</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Kurti Tops</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Sarees</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Night Wear</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Inner Wear</li>
          </ul>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-[var(--accent-primary)] mb-6">
            COMPANY
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-primary)] opacity-80">
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">About Us</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Careers</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Blog</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Privacy Policy</li>
            <li className="hover:text-[var(--accent-hover)] cursor-pointer transition">Terms & Conditions</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-[var(--accent-primary)] mb-6">
            STAY CONNECTED
          </h3>

          <p className="text-sm text-[var(--text-primary)] opacity-70 mb-4">
            Subscribe for exclusive launches & festive collections.
          </p>

          <div className="flex border border-[var(--border-soft)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 text-sm bg-transparent outline-none text-[var(--text-primary)]"
            />
            <button className="px-5 bg-[#1A1A1A] text-white text-sm hover:bg-[var(--accent-primary)] transition-all">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-[var(--border-soft)] py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-primary)] opacity-60">
          <p>© {new Date().getFullYear()} Vastra Villa. All Rights Reserved.</p>
          <p>Designed with elegance & tradition.</p>
        </div>
      </div>

    </footer>
  );
}