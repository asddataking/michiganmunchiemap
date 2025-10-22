"use client";

import { motion } from "framer-motion";
import { CheckCircle, Play, Star } from "lucide-react";

export default function ValueBand() {
  const trustCards = [
    {
      icon: <CheckCircle className="w-8 h-8 text-[#FF6A00]" />,
      title: "Verified Spots",
      description: "Every location is personally visited and verified by our team"
    },
    {
      icon: <Play className="w-8 h-8 text-[#FF6A00]" />,
      title: "Real Episodes",
      description: "Authentic content showcasing Michigan's food and cannabis culture"
    },
    {
      icon: <Star className="w-8 h-8 text-[#FF6A00]" />,
      title: "Earn with DankPass",
      description: "Get rewards and unlock exclusive perks with our loyalty program"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-[#F3F3F3] mb-3">
                {card.title}
              </h3>
              <p className="text-[#F3F3F3]/70 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
