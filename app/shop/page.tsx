"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, Star, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
  checkoutUrl: string;
};

async function loadProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/fourthwall/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadProducts().then((result) => {
      setProducts(result);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleProductClick = (product: Product) => {
    if (product.inStock) {
      window.open(product.checkoutUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 px-4 cinematic-lighting">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-neon-orange/30 bg-neon-orange/10 px-4 py-2 text-neon-orange text-sm font-medium mb-6">
                <ShoppingBag className="h-4 w-4" />
                <span>Official Merchandise</span>
              </div>
              
              <h1 className="text-display-lg font-bold text-white mb-6">
                Shop
                <span className="text-neon-orange text-glow"> DankNDevour</span>
                <br />
                Merchandise
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Show your love for Michigan's food and cannabis culture with our 
                exclusive merchandise and digital products.
              </p>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join DankPass
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4 bg-dank-black-light/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold"
                      : "border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="glass-panel animate-pulse">
                    <div className="aspect-square bg-dank-black-light rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-dank-black-light rounded mb-2"></div>
                      <div className="h-3 bg-dank-black-light rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-dank-black-light rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`glass-panel transition-all duration-300 h-full ${
                        product.inStock 
                          ? 'hover:neon-glow cursor-pointer' 
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        {product.image && product.image !== '/api/placeholder/300/300' ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 bg-gradient-to-br from-dank-black-light to-dank-black flex items-center justify-center ${product.image && product.image !== '/api/placeholder/300/300' ? 'hidden' : ''}`}>
                          <ShoppingBag className="h-16 w-16 text-neon-orange" />
                        </div>
                        <div className="absolute inset-0 bg-black/20"></div>
                        
                        {/* Stock Status */}
                        <div className="absolute top-2 right-2">
                          <Badge 
                            className={
                              product.inStock 
                                ? "bg-green-500/20 text-green-400 border border-green-400/30" 
                                : "bg-red-500/20 text-red-400 border border-red-400/30"
                            }
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-neon-orange/20 text-neon-orange border border-neon-orange/30">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {product.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-neon-orange">
                              ${product.price.toFixed(2)} {product.currency}
                            </span>
                            {product.category === 'Membership' && (
                              <div className="flex items-center gap-1 text-xs text-neon-orange">
                                <Star className="h-3 w-3" />
                                <span>Premium</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            className={`w-full ${
                              product.inStock
                                ? 'bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                            disabled={!product.inStock}
                          >
                            {product.inStock ? (
                              <>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Buy Now
                              </>
                            ) : (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Out of Stock
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-dank-black via-dank-black-light to-dank-black border-t border-neon-orange/20">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-display-md font-bold text-white mb-4">
                Join the <span className="text-neon-orange">DankPass</span> Community
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get exclusive access to premium content, early releases, and member-only 
                merchandise. Support our mission to showcase Michigan's culture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Heart className="h-5 w-5 mr-2" />
                    Join DankPass
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                <Link href="/join">
                  <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
