import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Michigan Munchies</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discovering Michigan's best food experiences, one bite at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-muted-foreground hover:text-foreground">
                  Browse Places
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-muted-foreground hover:text-foreground">
                  Featured Places
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cuisine/american" className="text-muted-foreground hover:text-foreground">
                  American
                </Link>
              </li>
              <li>
                <Link href="/cuisine/italian" className="text-muted-foreground hover:text-foreground">
                  Italian
                </Link>
              </li>
              <li>
                <Link href="/cuisine/mexican" className="text-muted-foreground hover:text-foreground">
                  Mexican
                </Link>
              </li>
              <li>
                <Link href="/cuisine/asian" className="text-muted-foreground hover:text-foreground">
                  Asian
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link href="mailto:hello@michiganmunchies.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/michiganmunchies" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/michiganmunchies" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Michigan Munchies. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ for Michigan food lovers. 
            <Link href="/submit" className="ml-1 underline hover:text-foreground">
              Submit a place
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
