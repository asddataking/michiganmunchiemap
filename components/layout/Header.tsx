'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Search, Menu, X, Play, ShoppingBag, Users, Heart, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: MapPin },
    { name: 'Episodes', href: '/episodes', icon: Play },
    { name: 'Munchie Map', href: '/munchie-map', icon: MapPin },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Join', href: '/join', icon: Users },
    { name: 'Support', href: '/support', icon: Heart },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-neon-orange/30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-orange to-neon-orange-dark rounded-lg flex items-center justify-center neon-glow">
                <MapPin className="h-5 w-5 text-dank-black" />
              </div>
              <div className="absolute inset-0 bg-neon-orange/20 rounded-lg blur-sm group-hover:bg-neon-orange/30 transition-colors"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white group-hover:text-neon-orange transition-colors">
                DankNDevour
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Food • Travel • Culture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-neon-orange hover:bg-neon-orange/10 transition-all duration-200 font-medium"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:text-neon-orange"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-neon-orange/20 bg-dank-black-light/50 backdrop-blur-md"
            >
              <nav className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-white hover:text-neon-orange hover:bg-neon-orange/10 transition-all duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
