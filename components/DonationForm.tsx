"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, User, MessageCircle, DollarSign } from "lucide-react";

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  
  const supportUrl = process.env.NEXT_PUBLIC_FOURTHWALL_DONATION_URL || "#";
  
  const presetAmounts = [1, 5, 20];
  
  const handleDonate = () => {
    // Create donation URL with parameters
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (message) params.append('message', message);
    params.append('amount', customAmount || selectedAmount.toString());
    
    const donationUrl = `${supportUrl}?${params.toString()}`;
    window.open(donationUrl, '_blank');
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#1A141D] to-[#0B0B0B]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wide">
              FEED THE CREW
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              You're directly fueling more food & weed reviews. You're a real one.
            </p>
          </motion.div>

          {/* Right Section - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            {/* Name Input */}
            <div className="mb-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FF6A00] transition-colors"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <div className="relative">
                <MessageCircle className="absolute left-4 top-4 text-white/50 w-4 h-4" />
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FF6A00] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-3">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-[#FF6A00] border-[#FF6A00] text-white'
                        : 'bg-white/5 border-white/20 text-white hover:border-white/40'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedAmount(0);
                    setCustomAmount("");
                  }}
                  className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                    customAmount || selectedAmount === 0
                      ? 'bg-[#FF6A00] border-[#FF6A00] text-white'
                      : 'bg-white/5 border-white/20 text-white hover:border-white/40'
                  }`}
                >
                  Custom
                </button>
              </div>
              
              {/* Custom Amount Input */}
              {(customAmount || selectedAmount === 0) && (
                <div className="mt-3">
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              className="w-full bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate & send message
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
