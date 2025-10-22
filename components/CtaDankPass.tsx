"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

export default function CtaDankPass() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[#FF6A00]/10 to-orange-600/10">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-2xl flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#F3F3F3] mb-4">
              Earn points. Unlock perks.
            </h2>
            
            <p className="text-xl text-[#F3F3F3]/70 mb-8 max-w-2xl mx-auto">
              Join DankPass and start earning rewards for every visit, purchase, and interaction. 
              Unlock exclusive deals, early access to new spots, and premium content.
            </p>
            
            <Link href="/join">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center mx-auto">
                  Join DankPass
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
