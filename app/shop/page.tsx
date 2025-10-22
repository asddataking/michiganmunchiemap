"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ExternalLink, Star, Heart, ArrowLeft, Loader2, Search, Filter, SortAsc, SortDesc, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadProductsWithCache = async (forceRefresh = false) => {
    try {
      const url = forceRefresh 
        ? '/api/fourthwall/products?refresh=true'
        : '/api/fourthwall/products';
      
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  };

  useEffect(() => {
    loadProductsWithCache().then((result) => {
      console.log('🛒 Shop page received products:', result);
      console.log('🛒 First product image:', result[0]?.image);
      setProducts(result);
      setLastUpdated(new Date());
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBuyNow = (product: Product) => {
    window.open(product.checkoutUrl, '_blank');
  };

  const handleRefreshProducts = async () => {
    setLoading(true);
    const result = await loadProductsWithCache(true);
    setProducts(result);
    setLastUpdated(new Date());
    setLoading(false);
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

        {/* Search and Filters */}
        <section className="py-8 px-4 bg-dank-black-light/30">
          <div className="container mx-auto max-w-6xl">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-dank-black-light/50 border-neon-orange/30 text-white placeholder:text-muted-foreground focus:border-neon-orange"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-dank-black-light/50 border border-neon-orange/30 text-white rounded-md px-3 py-2 pr-8 appearance-none focus:border-neon-orange focus:outline-none"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low-High</option>
                    <option value="price-desc">Price High-Low</option>
                  </select>
                  <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className={`transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
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

            {/* Results Count and Cache Status */}
            <div className="text-center mt-4 space-y-2">
              <div className="text-muted-foreground">
                Showing {filteredAndSortedProducts.length} of {products.length} products
                {searchQuery && ` for "${searchQuery}"`}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                {lastUpdated && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshProducts}
                  disabled={loading}
                  className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
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
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-orange/20 mb-4">
                  <Search className="h-8 w-8 text-neon-orange" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `No products match your search for "${searchQuery}"`
                    : `No products found in the "${selectedCategory}" category`
                  }
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="glass-panel transition-all duration-300 h-full flex flex-col hover:neon-glow cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        {product.image && product.image.trim() !== '' ? (
                          <Image 
                            src={product.image} 
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(e) => {
                              console.log('❌ Product image failed to load:', product.image);
                              // Hide the image and show placeholder
                              e.currentTarget.style.display = 'none';
                              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 bg-gradient-to-br from-dank-black-light to-dank-black flex items-center justify-center ${product.image && product.image.trim() !== '' ? 'hidden' : ''}`}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (product.inStock) {
                                handleBuyNow(product);
                              }
                            }}
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-dank-black-light rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                  className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  {selectedProduct.image && selectedProduct.image.trim() !== '' ? (
                    <Image 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-dank-black-light to-dank-black flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-neon-orange" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-neon-orange/20 text-neon-orange border border-neon-orange/30">
                        {selectedProduct.category}
                      </Badge>
                      <Badge 
                        className={
                          selectedProduct.inStock 
                            ? "bg-green-500/20 text-green-400 border border-green-400/30" 
                            : "bg-red-500/20 text-red-400 border border-red-400/30"
                        }
                      >
                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-neon-orange">
                    ${selectedProduct.price.toFixed(2)} {selectedProduct.currency}
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      className={`flex-1 ${
                        selectedProduct.inStock
                          ? 'bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      disabled={!selectedProduct.inStock}
                      onClick={() => handleBuyNow(selectedProduct)}
                    >
                      {selectedProduct.inStock ? (
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
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedProduct.checkoutUrl, '_blank')}
                      className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Store
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
