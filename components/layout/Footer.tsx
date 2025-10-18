import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neon-orange/20 bg-dank-black-light/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-orange to-neon-orange-dark rounded-lg flex items-center justify-center neon-glow">
                <MapPin className="h-5 w-5 text-dank-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white">DankNDevour</span>
                <span className="text-sm text-muted-foreground font-medium">
                  Food • Travel • Culture
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Your ultimate guide to Michigan's best food experiences, travel destinations, 
              and cannabis culture. Discover local gems and connect with the community.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.dankpass.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neon-orange hover:text-neon-orange-light transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Join DankPass
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/episodes" className="text-muted-foreground hover:text-neon-orange transition-colors">
                  Episodes
                </Link>
              </li>
              <li>
                <Link href="/munchie-map" className="text-muted-foreground hover:text-neon-orange transition-colors">
                  Munchie Map
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-neon-orange transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-muted-foreground hover:text-neon-orange transition-colors">
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="mailto:hello@dankndevour.com" 
                className="text-muted-foreground hover:text-neon-orange transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/dankndevour" 
                className="text-muted-foreground hover:text-neon-orange transition-colors"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/dankndevour" 
                className="text-muted-foreground hover:text-neon-orange transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@dankndevour" 
                className="text-muted-foreground hover:text-neon-orange transition-colors"
                title="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 DankNDevour. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-neon-orange/20 text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for Michigan food lovers and cannabis culture enthusiasts.
            <Link href="/support" className="ml-1 text-neon-orange hover:text-neon-orange-light transition-colors underline">
              Support our mission
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
