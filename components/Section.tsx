"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ 
  title, 
  subtitle, 
  viewAllLink, 
  children, 
  className = "" 
}: SectionProps) {
  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#F3F3F3] mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[#F3F3F3]/70 text-lg">
                {subtitle}
              </p>
            )}
          </div>
          
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-[#FF6A00] hover:text-[#FF6A00]/80 transition-colors duration-200 font-medium inline-flex items-center group"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
        
        {children}
      </div>
    </section>
  );
}
