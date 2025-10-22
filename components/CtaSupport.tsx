"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

export default function CtaSupport() {
  const supportUrl = process.env.NEXT_PUBLIC_FOURTHWALL_DONATION_URL || "#";

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-gradient-to-r from-[#FF6A00] to-orange-600 rounded-3xl p-8 md:p-12 text-center hover:shadow-2xl hover:shadow-[#FF6A00]/25 transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Support the Movement
              </h2>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Help us showcase Michigan's incredible food and cannabis culture. 
                Your support keeps our content free and helps us discover new hidden gems.
              </p>
              
              <div className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 group-hover:shadow-lg">
                Make a Donation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
