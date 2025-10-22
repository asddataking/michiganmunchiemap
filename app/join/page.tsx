"use client";

import { motion } from "framer-motion";
import { Star, Gift, Crown, Users, ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function JoinPage() {
  const perks = [
    {
      icon: <Star className="w-6 h-6 text-[#FF6A00]" />,
      title: "Earn Points",
      description: "Get rewarded for every visit, review, and interaction"
    },
    {
      icon: <Gift className="w-6 h-6 text-[#FF6A00]" />,
      title: "Exclusive Deals",
      description: "Access member-only discounts and special offers"
    },
    {
      icon: <Crown className="w-6 h-6 text-[#FF6A00]" />,
      title: "Early Access",
      description: "Be the first to discover new spots and content"
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF6A00]" />,
      title: "Community",
      description: "Connect with fellow Michigan food and cannabis enthusiasts"
    }
  ];

  const features = [
    "Track your favorite spots and earn points",
    "Get exclusive discounts at partner locations",
    "Early access to new episodes and content",
    "Member-only events and meetups",
    "Priority customer support",
    "Custom recommendations based on your preferences"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-[#0B0B0B] via-[#0B0B0B] to-[#1A1A1A]">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container mx-auto relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-3xl flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-[#F3F3F3] mb-6">
                Join <span className="text-[#FF6A00]">DankPass</span>
              </h1>
              <p className="text-xl text-[#F3F3F3]/80 mb-8">
                Unlock exclusive perks, earn rewards, and connect with Michigan's food and cannabis community
              </p>
            </motion.div>
          </div>
        </section>

        {/* Perks Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-black text-[#F3F3F3] mb-12 text-center">
              Why Join DankPass?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {perks.map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    {perk.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#F3F3F3] mb-3">
                    {perk.title}
                  </h3>
                  <p className="text-[#F3F3F3]/70 leading-relaxed">
                    {perk.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-black text-[#F3F3F3] mb-8">
                  What You Get
                </h2>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                      <span className="text-[#F3F3F3]/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#FF6A00]/10 to-orange-600/10 rounded-3xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold text-[#F3F3F3] mb-4">
                  Ready to Join?
                </h3>
                <p className="text-[#F3F3F3]/70 mb-6">
                  DankPass is currently in development. Sign up to be notified when we launch!
                </p>
                
                <div className="space-y-4">
                  <button className="w-full bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center">
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  
                  <p className="text-[#F3F3F3]/50 text-sm text-center">
                    Free to join • No spam • Unsubscribe anytime
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black text-[#F3F3F3] mb-4">
                Questions?
              </h2>
              <p className="text-xl text-[#F3F3F3]/70 mb-8">
                Have questions about DankPass? We're here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@dankndevour.com"
                  className="bg-white/10 hover:bg-white/20 text-[#F3F3F3] font-semibold px-8 py-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  Contact Us
                </a>
                <a
                  href="https://youtube.com/@dankndevour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25"
                >
                  Watch Our Content
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}