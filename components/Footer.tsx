"use client";

import Link from "next/link";
import { Instagram, Youtube, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const navItems = [
    { name: "Episodes", href: "/episodes" },
    { name: "Munchie Map", href: "/munchie-map" },
    { name: "Shop", href: "/shop" },
    { name: "Join Community", href: "/join" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/dankndevour", icon: <Instagram className="w-5 h-5" /> },
    { name: "YouTube", href: "https://youtube.com/@dankndevour", icon: <Youtube className="w-5 h-5" /> },
    { name: "Twitter", href: "https://twitter.com/dankndevour", icon: <Twitter className="w-5 h-5" /> },
    { name: "Email", href: "mailto:hello@dankndevour.com", icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-[#0B0B0B] border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/logo-detailed.svg" 
                alt="DANK N DEVOUR" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-[#F3F3F3]/70 text-sm leading-relaxed">
              Your ultimate guide to Michigan's best food experiences, travel destinations, and cannabis culture. 
              Discover local gems and connect with the community.
            </p>
            <Link href="/join">
              <button className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 text-sm">
                Join DankPass
              </button>
            </Link>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-[#F3F3F3] font-semibold text-lg">Explore</h3>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-[#F3F3F3]/70 hover:text-[#FF6A00] transition-colors duration-200 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-[#F3F3F3] font-semibold text-lg">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3F3F3]/70 hover:text-[#FF6A00] transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-[#F3F3F3]/50 text-xs">
              © 2024 DankNDevour. All rights reserved.
            </p>
            <p className="text-[#F3F3F3]/50 text-xs">
              Built with ❤️ for Michigan food lovers and cannabis culture enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
