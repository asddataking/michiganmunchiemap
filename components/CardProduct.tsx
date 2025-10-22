"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  checkoutUrl: string;
}

interface CardProductProps {
  product: Product;
}

export default function CardProduct({ product }: CardProductProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="group">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-product.jpg";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#F3F3F3] mb-2 group-hover:text-[#FF6A00] transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-[#FF6A00]">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {/* CTA Button */}
          <a
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <button className="w-full bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-medium px-4 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center group">
              View on Fourthwall
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
