"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Map", href: "/munchie-map" },
    { name: "Episodes", href: "/episodes" },
    { name: "Shop", href: "/shop" },
    { name: "Join DankPass", href: "/join" },
  ];

  const supportUrl = process.env.NEXT_PUBLIC_FOURTHWALL_DONATION_URL || "#";

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-[#F3F3F3] font-bold text-xl">DankNDevour</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#F3F3F3] hover:text-[#FF6A00] transition-colors duration-200 text-base font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Support Us Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25"
            >
              <Heart className="w-4 h-4 mr-2 inline" />
              Support Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#F3F3F3] hover:text-[#FF6A00] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#F3F3F3] hover:text-[#FF6A00] transition-colors duration-200 text-base font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4 mr-2 inline" />
                Support Us
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
