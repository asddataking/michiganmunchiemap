"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, MapPin, Pizza, Sandwich, UtensilsCrossed, Coffee, Zap, Star, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Place = {
  id: string;
  name: string;
  slug: string;
  city?: string;
  cuisines?: string[];
};

const categories = [
  { name: "Pizza", icon: Pizza, href: "/cuisine/Pizza" },
  { name: "Burgers", icon: Sandwich, href: "/cuisine/Burgers" },
  { name: "Indian", icon: UtensilsCrossed, href: "/cuisine/Indian" },
  { name: "Smoothies", icon: Coffee, href: "/cuisine/Smoothies" },
];

async function loadLatest(limit = 8): Promise<Place[]> {
  try {
    const res = await fetch(`/api/places?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    // Handle the API response structure - it might be wrapped in a 'data' property
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

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [latest, setLatest] = useState<Place[]>([]);

  useEffect(() => { 
    loadLatest().then((result) => {
      console.log('Loaded latest places:', result);
      setLatest(Array.isArray(result) ? result : []);
    });
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100 relative overflow-hidden">
      {/* Retro grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm font-mono tracking-wider shadow-lg shadow-cyan-400/20">
              <Zap className="h-4 w-4 animate-pulse" /> 
              <span className="text-xs">MICHIGAN MUNCHIE MAP v2.0</span>
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl font-mono">
              <span className="text-cyan-400 drop-shadow-lg">FIND</span>
              <br />
              <span className="text-yellow-400 drop-shadow-lg">YOUR</span>
              <br />
              <span className="text-pink-400 drop-shadow-lg">MUNCHIE</span>
            </h1>
            <p className="mt-6 max-w-prose text-zinc-300 text-lg font-mono">
              <span className="text-green-400">[SYSTEM READY]</span> Michigan's ultimate food directory. 
              <br />
              <span className="text-yellow-400">Search • Discover • Devour</span>
            </p>

            <form onSubmit={onSearch} className="mt-8 flex items-center gap-3">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder='[ENTER SEARCH] "Detroit pizza" or "Royal Oak"'
                  className="h-14 bg-black/80 border-2 border-cyan-400/50 pl-12 text-cyan-100 placeholder:text-cyan-400/60 font-mono text-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold font-mono text-lg border-2 border-cyan-400 shadow-lg shadow-cyan-400/30"
              >
                [SEARCH]
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-mono">
              <span className="text-green-400">[POPULAR CATEGORIES]:</span>
              {categories.map((c) => (
                <Link key={c.name} href={c.href} className="text-cyan-400 hover:text-yellow-400 transition-colors border border-cyan-400/30 px-2 py-1 rounded hover:border-yellow-400/50">
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Link href="/map">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold font-mono border-2 border-green-400 shadow-lg shadow-green-400/30">
                  [OPEN MAP]
                </Button>
              </Link>
              <Link href="/places">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold font-mono border-2 border-yellow-400 shadow-lg shadow-yellow-400/30">
                  [BROWSE ALL]
                </Button>
              </Link>
            </div>
          </div>

          {/* Static Map Preview */}
          <Card className="border-2 border-cyan-400/50 bg-black/80 backdrop-blur-sm">
            <CardHeader className="border-b border-cyan-400/30">
              <CardTitle className="flex items-center gap-3 font-mono text-cyan-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <MapPin className="h-5 w-5" /> 
                </div>
                <span className="text-lg">[LIVE MAP PREVIEW]</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-[4/3] w-full relative overflow-hidden">
                {/* Michigan Map Image */}
                <div className="absolute inset-0">
                  {/* Actual Michigan map image - replace with your map image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
                    {/* Placeholder for now - you can add an actual map image here */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 border-2 border-cyan-400/50 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <MapPin className="h-16 w-16 text-cyan-400" />
                        </div>
                        <p className="text-cyan-400 font-mono text-sm">Michigan Map</p>
                        <p className="text-cyan-400/60 font-mono text-xs mt-1">Southeast Region</p>
                        <p className="text-cyan-400/40 font-mono text-xs mt-2">Add map image to /public/maps/</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Uncomment and update this when you have a map image:
                  <Image
                    src="/maps/michigan-map.jpg"
                    alt="Michigan Map"
                    fill
                    className="object-cover opacity-80"
                    priority
                  />
                  */}
                  
                  {/* Restaurant markers overlaid on map */}
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50 border-2 border-white"></div>
                  <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50 border-2 border-white"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50 border-2 border-white"></div>
                  <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50 border-2 border-white"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50 border-2 border-white"></div>
                  
                  {/* Retro text overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/90 border border-cyan-400/50 p-3 font-mono text-xs backdrop-blur-sm">
                    <div className="text-cyan-400">[SYSTEM STATUS]</div>
                    <div className="text-green-400">✓ 5 RESTAURANTS LOADED</div>
                    <div className="text-yellow-400">✓ GPS COORDINATES ACTIVE</div>
                    <div className="text-pink-400">✓ REAL-TIME TRACKING ENABLED</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-cyan-400/30">
                <p className="text-xs text-cyan-400/80 font-mono">
                  [STATIC PREVIEW] Click "[OPEN MAP]" for interactive experience
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10">
        <h2 className="mb-6 text-2xl font-bold font-mono text-cyan-400">
          [BROWSE CATEGORIES]
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <Card className="group h-28 border-2 border-cyan-400/30 bg-black/60 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/60 hover:bg-black/80 hover:shadow-lg hover:shadow-cyan-400/20">
                <CardContent className="flex h-full items-center justify-center gap-3 p-4">
                  <cat.icon className="h-8 w-8 text-cyan-400 group-hover:text-yellow-400 transition-colors" />
                  <span className="font-bold font-mono text-cyan-300 group-hover:text-yellow-300 text-sm">
                    {cat.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold font-mono text-pink-400">
            [NEWEST ON THE MAP]
          </h2>
          <Link href="/places" className="text-sm text-cyan-400 hover:text-yellow-400 font-mono border border-cyan-400/30 px-3 py-1 rounded transition-colors hover:border-yellow-400/50">
            [SEE ALL]
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(latest) && latest.map((p) => (
            <Link key={p.id} href={`/place/${p.slug}`}>
              <Card className="group h-full border-2 border-pink-400/30 bg-black/60 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/60 hover:bg-black/80 hover:shadow-lg hover:shadow-pink-400/20">
                <CardHeader className="pb-2 border-b border-pink-400/20">
                  <CardTitle className="truncate text-base font-mono text-pink-300 group-hover:text-yellow-300">
                    {p.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div className="text-sm text-cyan-400 font-mono">{p.city}</div>
                  <div className="flex flex-wrap gap-1">
                    {(p.cuisines ?? []).slice(0, 3).map((c) => (
                      <Badge key={c} className="bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-mono text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
                    <Star className="h-3 w-3" />
                    <span>[FEATURED SPOT]</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Dankpass CTA */}
      <section className="relative border-t-2 border-cyan-400/30 bg-gradient-to-r from-black via-zinc-950 to-black py-12">
        {/* Retro scan lines effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
          }}></div>
        </div>
        
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center">
          <div className="text-center">
            <h3 className="text-3xl font-bold font-mono text-yellow-400 mb-4">
              [JOIN DANKPASS]
            </h3>
            <p className="text-lg text-cyan-400 font-mono mb-2">
              Unlock exclusive deals and premium features
            </p>
            <p className="text-sm text-green-400 font-mono">
              [PREMIUM MEMBERSHIP] • [EXCLUSIVE DEALS] • [PRIORITY ACCESS]
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://www.dankpass.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold font-mono border-2 border-green-400 shadow-lg shadow-green-400/30 text-lg px-8 py-4">
                [JOIN DANKPASS]
              </Button>
            </a>
            <Link href="/submit">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold font-mono border-2 border-pink-400 shadow-lg shadow-pink-400/30">
                [SUBMIT PLACE]
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-cyan-400/30 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-xl font-bold font-mono text-cyan-400 mb-4">
                [MICHIGAN MUNCHIE MAP]
              </h4>
              <p className="text-cyan-400/80 font-mono text-sm mb-4">
                Michigan's ultimate food directory. 
                <br />
                Find your next munchies with style.
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm border border-cyan-400/30 px-3 py-1 rounded hover:border-yellow-400/50"
                >
                  [DANKPASS]
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h5 className="text-lg font-bold font-mono text-yellow-400 mb-4">
                [NAVIGATE]
              </h5>
              <ul className="space-y-2">
                <li><Link href="/home" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[HOME]</Link></li>
                <li><Link href="/map" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[MAP]</Link></li>
                <li><Link href="/places" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[BROWSE]</Link></li>
                <li><Link href="/featured" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[FEATURED]</Link></li>
                <li><Link href="/submit" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[SUBMIT]</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h5 className="text-lg font-bold font-mono text-pink-400 mb-4">
                [CATEGORIES]
              </h5>
              <ul className="space-y-2">
                <li><Link href="/cuisine/Pizza" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[PIZZA]</Link></li>
                <li><Link href="/cuisine/Burgers" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[BURGERS]</Link></li>
                <li><Link href="/cuisine/Indian" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[INDIAN]</Link></li>
                <li><Link href="/cuisine/Smoothies" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[SMOOTHIES]</Link></li>
                <li><Link href="/places" className="text-cyan-400 hover:text-yellow-400 transition-colors font-mono text-sm">[ALL CUISINES]</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-cyan-400/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cyan-400/60 font-mono text-xs">
              © 2024 Michigan Munchie Map. [SYSTEM ONLINE]
            </p>
            <div className="flex gap-4 text-xs font-mono">
              <Link href="/about" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">[ABOUT]</Link>
              <Link href="/privacy" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">[PRIVACY]</Link>
              <Link href="/terms" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">[TERMS]</Link>
              <Link href="/contact" className="text-cyan-400/60 hover:text-cyan-400 transition-colors">[CONTACT]</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
