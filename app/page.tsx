"use client";

import { Instagram, Youtube, Twitter, Mail } from "lucide-react";

export default function RootPage() {
  const links = [
    { 
      name: "Instagram", 
      href: "https://instagram.com/dankndevour", 
      icon: <Instagram className="w-5 h-5" />
    },
    { 
      name: "YouTube", 
      href: "https://youtube.com/@dankndevour", 
      icon: <Youtube className="w-5 h-5" />
    },
    { 
      name: "Twitter", 
      href: "https://twitter.com/dankndevour", 
      icon: <Twitter className="w-5 h-5" />
    },
    { 
      name: "Email", 
      href: "mailto:hello@dankndevour.com", 
      icon: <Mail className="w-5 h-5" />
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-detailed.svg"
            alt="DANK N DEVOUR"
            className="h-20 w-auto"
          />
        </div>

        {/* CTA */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Join the Dank Network
          </h1>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="flex items-center justify-center w-full px-6 py-4 bg-white text-black rounded-lg font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-3">
                {link.icon}
                <span>{link.name}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}