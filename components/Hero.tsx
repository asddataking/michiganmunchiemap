"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Play, Heart, ShoppingBag } from "lucide-react";

export default function Hero() {
  const supportUrl = process.env.NEXT_PUBLIC_FOURTHWALL_DONATION_URL || "#";

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-[#0B0B0B] via-[#0B0B0B] to-[#1A1A1A]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#F3F3F3] mb-6 leading-tight">
            Where Food Meets the{" "}
            <span className="text-[#FF6A00]">HighLife</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#F3F3F3]/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Find Michigan's best bites and dispensary deals. Earn rewards.
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/munchie-map">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center w-full sm:w-auto">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Map
                </button>
              </motion.div>
            </Link>
            
            <Link href="/episodes">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="bg-white/10 hover:bg-white/20 text-[#F3F3F3] font-semibold px-8 py-4 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center justify-center w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Episodes
                </button>
              </motion.div>
            </Link>
            
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="bg-transparent border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center w-full sm:w-auto">
                  <Heart className="w-5 h-5 mr-2" />
                  Support Us
                </button>
              </motion.div>
            </a>
          </div>

          {/* Optional Shop Link */}
          <div className="text-center">
            <Link 
              href="/shop"
              className="text-[#FF6A00] hover:text-[#FF6A00]/80 transition-colors duration-200 text-sm font-medium inline-flex items-center"
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              Shop our gear
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
