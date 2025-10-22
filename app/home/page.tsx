"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import ValueBand from "@/components/ValueBand";
import Section from "@/components/Section";
import CardPlace from "@/components/CardPlace";
import CardEpisode from "@/components/CardEpisode";
import CardProduct from "@/components/CardProduct";
import CtaDankPass from "@/components/CtaDankPass";
import CtaSupport from "@/components/CtaSupport";
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
          loadLatest(6),
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

        {/* EXISTING MAP JSX — DO NOT TOUCH ANYTHING INSIDE OR AROUND THIS BLOCK */}
        {/* Note: The current homepage doesn't have the actual map embedded, just a preview */}
        {/* If you want to add the actual map here, it would go in this section */}
        <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-black text-[#F3F3F3] mb-8">
              Interactive Munchie Map
            </h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <div className="w-32 h-32 mx-auto mb-6 border-2 border-[#FF6A00]/50 rounded-lg bg-[#0B0B0B] flex items-center justify-center">
                <span className="text-6xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-[#F3F3F3] mb-4">
                Discover Michigan's Best Spots
              </h3>
              <p className="text-[#F3F3F3]/70 mb-6">
                Explore our interactive map to find verified restaurants, dispensaries, and hidden gems across Michigan.
              </p>
              <a
                href="/munchie-map"
                className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 inline-block"
              >
                Explore Map
              </a>
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
              {latest.map((place, index) => (
                <CardPlace
                  key={place.id}
                  place={place}
                  index={index}
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
              {products.map((product, index) => (
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
                  index={index}
                />
              ))}
            </div>
          )}
        </Section>

        <CtaDankPass />
        <CtaSupport />
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
              {episodes.map((episode, index) => (
                <CardEpisode
                  key={episode.id}
                  episode={episode}
                  index={index}
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