'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Michigan Munchies</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/home">
            <Button variant="ghost" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          
          <Link href="/map">
            <Button variant="ghost" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Map
            </Button>
          </Link>
          
          <Link href="/places">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Browse
            </Button>
          </Link>
          
          <Link href="/featured">
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Featured
            </Button>
          </Link>

          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
