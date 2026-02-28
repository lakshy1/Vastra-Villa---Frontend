"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const heroImages = [
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
];

const categories = [
  {
    title: "Unstitched Suit",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Kurti Tops",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Sarees",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Night Wear",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Inner Wear",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800&auto=format&fit=crop",
  },
];

const products = [
  {
    id: 1,
    title: "Classic Cotton Kurti",
    price: 1899,
    category: "Kurti",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Festive Silk Saree",
    price: 3499,
    category: "Saree",
    image:
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Premium Night Suit",
    price: 1299,
    category: "Night Wear",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Embroidered Suit Set",
    price: 4599,
    category: "Unstitched",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
  },
];

const filters = ["All", "Kurti", "Saree", "Night Wear", "Unstitched"];

export default function Dashboard() {
  const [activeHero, setActiveHero] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!paused) {
        setActiveHero((prev) => (prev + 1) % heroImages.length);
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const handleMouseEnter = () => {
    setPaused(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setPaused(false);
    }, 2000);
  };

  const filteredProducts =
    activeFilter === "All" ? products : products.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-alabaster">
      <section
        className="relative h-screen w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.img
          key={activeHero}
          src={heroImages[activeHero]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: paused ? 1.5 : 0.8 }}
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {heroImages.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition ${i === activeHero ? "bg-champagne" : "bg-white/60"}`} />
          ))}
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-obsidian mb-16">Featured Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                width={400}
                height={500}
                className="object-cover w-full h-64 group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition" />

              <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg">{cat.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-obsidian mb-10">New & Popular</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 text-sm border rounded-lg transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-obsidian text-alabaster"
                  : "border-softSilk text-obsidian hover:bg-champagne hover:text-obsidian"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <motion.div key={product.id} whileHover={{ y: -6 }} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={500}
                  className="object-cover w-full h-80 group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="mt-4">
                <h4 className="text-obsidian font-medium">{product.title}</h4>
                <p className="text-deepRoseGold font-semibold mt-1">INR {product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
