"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, RefreshCw, Search, Filter } from 'lucide-react';
import CardProduct from '@/components/CardProduct';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
    console.log('🛒 Shop page useEffect triggered');
    loadProductsWithCache().then((result) => {
      console.log('🛒 Shop page received products:', result);
      setProducts(result);
      setLastUpdated(new Date());
      setLoading(false);
    }).catch((error) => {
      console.error('🛒 Error loading products:', error);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRefresh = async () => {
    setLoading(true);
    const result = await loadProductsWithCache(true);
    setProducts(result);
    setLastUpdated(new Date());
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-[#0B0B0B] via-[#0B0B0B] to-[#1A1A1A]">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container mx-auto relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-3xl flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-[#F3F3F3] mb-6">
                Official Merchandise
              </h1>
              <p className="text-xl text-[#F3F3F3]/80 mb-8">
                Show your love for Michigan's food and cannabis culture with our exclusive merchandise and digital products.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 px-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F3F3F3]/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#F3F3F3] placeholder-[#F3F3F3]/50 focus:outline-none focus:border-[#FF6A00] transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#F3F3F3]/50" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[#F3F3F3] focus:outline-none focus:border-[#FF6A00] transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-[#0B0B0B]">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white/10 hover:bg-white/20 text-[#F3F3F3] px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A00]"></div>
                <p className="text-[#F3F3F3]/70 mt-4">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-[#F3F3F3]/30 mx-auto mb-4" />
                <p className="text-[#F3F3F3]/70 text-lg">No products found.</p>
                <p className="text-[#F3F3F3]/50 mt-2">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Check back soon for new merchandise!'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#F3F3F3]">
                    Showing {filteredProducts.length} of {products.length} products
                  </h2>
                  {lastUpdated && (
                    <p className="text-[#F3F3F3]/50 text-sm">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <CardProduct
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black text-[#F3F3F3] mb-4">
                Don't See What You're Looking For?
              </h2>
              <p className="text-xl text-[#F3F3F3]/70 mb-8">
                We're constantly adding new merchandise. Follow us for updates on new drops!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://youtube.com/@dankndevour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25"
                >
                  Subscribe on YouTube
                </a>
                <a
                  href="https://instagram.com/dankndevour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-[#F3F3F3] font-semibold px-8 py-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  Follow on Instagram
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}