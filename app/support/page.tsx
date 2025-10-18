"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  const handleSupportClick = () => {
    // Redirect to Fourthwall support checkout
    window.open('https://fourthwall.com/support', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-orange to-neon-orange-dark rounded-full mb-8 neon-glow">
            <Heart className="h-10 w-10 text-dank-black" />
          </div>

          {/* Title */}
          <h1 className="text-display-lg font-bold text-white mb-6">
            Support Our Mission
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Help us continue creating amazing content, discovering hidden gems, 
            and building a community around Michigan's best food and cannabis culture.
          </p>

          {/* Support Button */}
          <Button 
            size="lg"
            className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold text-lg px-8 py-4 h-auto"
            onClick={handleSupportClick}
          >
            Support Us Now
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground mt-6">
            Your support helps us discover new restaurants, create content, and grow our community.
          </p>

          {/* Alternative Options */}
          <div className="mt-12 pt-8 border-t border-neon-orange/20">
            <p className="text-muted-foreground mb-4">Or explore other ways to support:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-dank-black font-semibold"
                onClick={() => window.location.href = '/shop'}
              >
                Shop Merchandise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                className="border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-dank-black font-semibold"
                onClick={() => window.location.href = '/join'}
              >
                Join Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}