'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  Plus, 
  Upload, 
  Settings, 
  BarChart3,
  Users,
  FileText
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
    },
    {
      name: 'Places',
      href: '/admin/places',
      icon: MapPin,
    },
    {
      name: 'Add Place',
      href: '/admin/places/new',
      icon: Plus,
    },
    {
      name: 'CSV Import',
      href: '/admin/import',
      icon: Upload,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-card border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Admin</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Michigan Munchies
        </p>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm font-medium">Admin User</div>
          <div className="text-xs text-muted-foreground">
            admin@michiganmunchies.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
