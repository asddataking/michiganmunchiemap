"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import ValueBand from "@/components/ValueBand";
import Section from "@/components/Section";
import CardPlace from "@/components/CardPlace";
import CardEpisode from "@/components/CardEpisode";
import CardProduct from "@/components/CardProduct";
import CtaDankPass from "@/components/CtaDankPass";
import DonationForm from "@/components/DonationForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/fourthwall";

type Place = {
  id: string;
  name: string;
  slug: string;
  city?: string;
  cuisines?: string[];
  image?: string;
  rating?: number;
  is_featured?: boolean;
};

type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  duration?: string;
  viewCount?: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  productUrl: string;
};

async function loadLatest(limit = 8): Promise<Place[]> {
  try {
    const res = await fetch(`/api/places?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error('Error loading places:', error);
    return [];
  }
}

async function loadEpisodes(limit = 3): Promise<Episode[]> {
  try {
    const res = await fetch(`/api/episodes?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading episodes:', error);
    return [];
  }
}

export default function HomePage() {
  const [latest, setLatest] = useState<Place[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placesData, episodesData, productsData] = await Promise.all([
          loadLatest(3),
          loadEpisodes(3),
          getProducts()
        ]);
        
        setLatest(placesData);
        setEpisodes(episodesData);
        setProducts(productsData.slice(0, 4)); // Show 4 products on homepage
        setLoading(false);
      } catch (error) {
        console.error('Error loading homepage data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <ValueBand />

        {/* Interactive Munchie Map Preview */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border border-[#FF6A00]/30 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-24 h-24 border border-[#FF6A00]/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-[#FF6A00]/25 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-32 right-1/3 w-28 h-28 border border-[#FF6A00]/20 rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#F3F3F3] mb-6">
                Interactive <span className="text-[#FF6A00]">Munchie Map</span>
              </h2>
              <p className="text-xl text-[#F3F3F3]/70 max-w-3xl mx-auto">
                Discover Michigan's most authentic food experiences, verified dispensaries, and hidden gems all in one interactive map
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Features */}
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-lg">📍</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F3F3F3] mb-2">Verified Spots</h3>
                    <p className="text-[#F3F3F3]/70 text-sm">Every location is personally verified by our team</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-lg">⭐</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F3F3F3] mb-2">Real Reviews</h3>
                    <p className="text-[#F3F3F3]/70 text-sm">Authentic ratings from our community</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-lg">🚗</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F3F3F3] mb-2">Easy Navigation</h3>
                    <p className="text-[#F3F3F3]/70 text-sm">One-click directions to any location</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-lg">🔥</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F3F3F3] mb-2">Hidden Gems</h3>
                    <p className="text-[#F3F3F3]/70 text-sm">Discover spots you won't find anywhere else</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Interactive Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#FF6A00]/10 to-orange-600/10 backdrop-blur-sm border border-[#FF6A00]/20 rounded-3xl p-8 relative overflow-hidden">
                  {/* Animated Map Preview */}
                  <div className="relative bg-[#0B0B0B] rounded-2xl p-6 mb-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {/* Animated Map Pins */}
                      <div className="flex justify-center">
                        <div className="w-4 h-4 bg-[#FF6A00] rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse delay-1000"></div>
                      </div>
                    </div>
                    
                    {/* Map Grid Lines */}
                    <div className="space-y-2">
                      <div className="h-1 bg-white/10 rounded animate-pulse"></div>
                      <div className="h-1 bg-white/10 rounded animate-pulse delay-200"></div>
                      <div className="h-1 bg-white/10 rounded animate-pulse delay-400"></div>
                      <div className="h-1 bg-white/10 rounded animate-pulse delay-600"></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FF6A00]">500+</div>
                      <div className="text-xs text-[#F3F3F3]/70">Verified Spots</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FF6A00]">83</div>
                      <div className="text-xs text-[#F3F3F3]/70">Counties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FF6A00]">24/7</div>
                      <div className="text-xs text-[#F3F3F3]/70">Updated</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="/munchie-map"
                    className="w-full bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center group"
                  >
                    <span className="mr-2">Explore Interactive Map</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </a>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FF6A00]/20 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500/20 rounded-full animate-bounce delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        <Section title="Spots Near You">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A00]"></div>
              <p className="text-[#F3F3F3]/70 mt-4">Loading places...</p>
            </div>
          ) : latest.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#F3F3F3]/70 text-lg">No places available at the moment.</p>
              <p className="text-[#F3F3F3]/50 mt-2">Check back soon for new spots!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latest.map((place) => (
                <CardPlace
                  key={place.id}
                  place={place}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Fresh Drops from the Shop" viewAllLink="/shop">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A00]"></div>
              <p className="text-[#F3F3F3]/70 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#F3F3F3]/70 text-lg">No products available at the moment.</p>
              <p className="text-[#F3F3F3]/50 mt-2">Check back soon for new merchandise!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <CardProduct
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    currency: 'USD',
                    image: product.imageUrl,
                    checkoutUrl: product.productUrl
                  }}
                />
              ))}
            </div>
          )}
        </Section>

        <CtaDankPass />
        <DonationForm />

        <Section title="Latest Episodes" viewAllLink="/episodes">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A00]"></div>
              <p className="text-[#F3F3F3]/70 mt-4">Loading episodes...</p>
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#F3F3F3]/70 text-lg">No episodes available at the moment.</p>
              <p className="text-[#F3F3F3]/50 mt-2">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {episodes.map((episode) => (
                <CardEpisode
                  key={episode.id}
                  episode={episode}
                />
              ))}
            </div>
          )}
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}