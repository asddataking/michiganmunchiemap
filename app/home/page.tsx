"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, MapPin, Play, ShoppingBag, Users, Heart, Star, ArrowRight, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Place = {
  id: string;
  name: string;
  slug: string;
  city?: string;
  cuisines?: string[];
};

type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
};

const categories = [
  { name: "Pizza", icon: "🍕", href: "/cuisine/Pizza" },
  { name: "Burgers", icon: "🍔", href: "/cuisine/Burgers" },
  { name: "Indian", icon: "🍛", href: "/cuisine/Indian" },
  { name: "Smoothies", icon: "🥤", href: "/cuisine/Smoothies" },
];

async function loadLatest(limit = 8): Promise<Place[]> {
  try {
    const res = await fetch(`/api/places?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch {
    // Fallback demo items for local/dev
    return [
      { id: "1", name: "Pink Garlic", slug: "pink-garlic-shelby-township", city: "Shelby Township, MI", cuisines: ["Indian"] },
      { id: "2", name: "Lovaburger", slug: "lovaburger-chesterfield", city: "Chesterfield, MI", cuisines: ["American","Burgers"] },
      { id: "3", name: "Fort Gratiot Nutrition", slug: "fort-gratiot-nutrition", city: "Fort Gratiot, MI", cuisines: ["Smoothies","Tea"] },
      { id: "4", name: "Lexington Nutrition", slug: "lexington-nutrition", city: "Lexington, MI", cuisines: ["Smoothies","Tea"] },
      { id: "5", name: "Pizza de Palazoo", slug: "pizza-de-palazoo-royal-oak", city: "Royal Oak, MI", cuisines: ["Pizza"] },
    ];
  }
}

async function loadEpisodes(limit = 3): Promise<Episode[]> {
  try {
    const res = await fetch(`/api/episodes?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // Fallback demo episodes
    return [
      {
        id: "1",
        title: "Detroit's Hidden Pizza Gems",
        description: "Exploring the best pizza spots in Detroit that locals don't want you to know about.",
        thumbnail: "/api/placeholder/400/225",
        publishedAt: "2024-01-15",
        videoId: "demo1"
      },
      {
        id: "2", 
        title: "Cannabis Culture in Ann Arbor",
        description: "A deep dive into Ann Arbor's thriving cannabis community and culture.",
        thumbnail: "/api/placeholder/400/225",
        publishedAt: "2024-01-10",
        videoId: "demo2"
      },
      {
        id: "3",
        title: "Food Truck Friday Adventures",
        description: "Hunting down the best food trucks across Michigan's major cities.",
        thumbnail: "/api/placeholder/400/225",
        publishedAt: "2024-01-05",
        videoId: "demo3"
      }
    ];
  }
}

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [latest, setLatest] = useState<Place[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => { 
    loadLatest().then((result) => {
      console.log('Loaded latest places:', result);
      setLatest(Array.isArray(result) ? result : []);
    });
    
    loadEpisodes().then((result) => {
      console.log('Loaded episodes:', result);
      setEpisodes(Array.isArray(result) ? result : []);
    });
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 cinematic-lighting">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-neon-orange/30 bg-neon-orange/10 px-4 py-2 text-neon-orange text-sm font-medium mb-6">
                  <Star className="h-4 w-4" />
                  <span>Michigan's Premier Lifestyle Hub</span>
                </div>
                
                <h1 className="text-display-xl font-bold text-white mb-6 leading-tight">
                  Discover Michigan's
                  <br />
                  <span className="text-neon-orange text-glow">Best Kept</span>
                  <br />
                  Secrets
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  From hidden food gems to cannabis culture hotspots, explore Michigan's 
                  vibrant lifestyle scene with our curated guides and interactive map.
                </p>

                <form onSubmit={onSearch} className="mb-8">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search restaurants, cities, or cuisines..."
                        className="h-12 bg-dank-black-light/50 border-neon-orange/30 pl-12 text-white placeholder:text-muted-foreground focus:border-neon-orange focus:ring-neon-orange/20"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="h-12 px-8 bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow"
                    >
                      Search
                    </Button>
                  </div>
                </form>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="text-sm text-muted-foreground">Popular:</span>
                  {categories.map((cat) => (
                    <Link key={cat.name} href={cat.href}>
                      <Badge variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 cursor-pointer">
                        {cat.icon} {cat.name}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Link href="/munchie-map">
                    <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                      <MapPin className="h-5 w-5 mr-2" />
                      Explore Map
                    </Button>
                  </Link>
                  <Link href="/episodes">
                    <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Episodes
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Map Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="glass-panel neon-glow">
                  <CardHeader className="border-b border-neon-orange/20">
                    <CardTitle className="flex items-center gap-3 text-neon-orange">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-neon-orange rounded-full animate-pulse"></div>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-lg">Live Munchie Map</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] w-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-dank-black-light via-dank-black-lighter to-dank-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-4 border-2 border-neon-orange/50 rounded-lg bg-dank-black-light flex items-center justify-center neon-glow">
                              <MapPin className="h-16 w-16 text-neon-orange" />
                            </div>
                            <p className="text-neon-orange font-semibold">Michigan Map</p>
                            <p className="text-muted-foreground text-sm mt-1">Interactive Discovery</p>
                          </div>
                        </div>
                        
                        {/* Restaurant markers */}
                        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-neon-orange rounded-full animate-pulse neon-glow border-2 border-white"></div>
                        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-neon-orange rounded-full animate-pulse neon-glow border-2 border-white"></div>
                        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-neon-orange rounded-full animate-pulse neon-glow border-2 border-white"></div>
                        <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-neon-orange rounded-full animate-pulse neon-glow border-2 border-white"></div>
                        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-neon-orange rounded-full animate-pulse neon-glow border-2 border-white"></div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-neon-orange/20">
                      <p className="text-xs text-muted-foreground">
                        Click "Explore Map" for full interactive experience
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Episodes */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-display-sm font-bold text-white">
                Latest Episodes
              </h2>
              <Link href="/episodes">
                <Button variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                  View All Episodes
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass-panel hover:neon-glow transition-all duration-300 group cursor-pointer">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-dank-black-light to-dank-black flex items-center justify-center">
                        <Play className="h-16 w-16 text-neon-orange group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2 group-hover:text-neon-orange transition-colors">
                        {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {episode.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(episode.publishedAt).toLocaleDateString()}</span>
                        <span className="text-neon-orange">Watch Now</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4 bg-dank-black-light/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-display-sm font-bold text-white mb-8 text-center">
              Explore Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={cat.href}>
                    <Card className="glass-panel hover:neon-glow transition-all duration-300 group cursor-pointer h-24">
                      <CardContent className="flex h-full items-center justify-center gap-3 p-4">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-semibold text-white group-hover:text-neon-orange transition-colors">
                          {cat.name}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Places */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-display-sm font-bold text-white">
                Newest Discoveries
              </h2>
              <Link href="/places">
                <Button variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                  Browse All Places
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(latest) && latest.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/place/${place.slug}`}>
                    <Card className="glass-panel hover:neon-glow transition-all duration-300 group cursor-pointer h-full">
                      <CardHeader className="pb-2 border-b border-neon-orange/20">
                        <CardTitle className="text-white group-hover:text-neon-orange transition-colors line-clamp-1">
                          {place.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        <div className="text-sm text-muted-foreground">{place.city}</div>
                        <div className="flex flex-wrap gap-1">
                          {(place.cuisines ?? []).slice(0, 3).map((c) => (
                            <Badge key={c} className="bg-neon-orange/20 text-neon-orange border border-neon-orange/30 text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neon-orange">
                          <Star className="h-3 w-3" />
                          <span>Featured Spot</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DankPass CTA */}
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
                Unlock exclusive deals, premium features, and connect with Michigan's 
                most passionate food and cannabis culture enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Users className="h-5 w-5 mr-2" />
                    Join DankPass
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                <Link href="/join">
                  <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    <Heart className="h-5 w-5 mr-2" />
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
