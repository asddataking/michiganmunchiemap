"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Calendar, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

async function loadEpisodes(): Promise<Episode[]> {
  try {
    const res = await fetch('/api/episodes', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch episodes');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading episodes:', error);
    return [];
  }
}

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEpisodes().then((result) => {
      setEpisodes(result);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViewCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  const handleEpisodeClick = (episode: Episode) => {
    window.open(`https://youtube.com/watch?v=${episode.videoId}`, '_blank');
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
                <Play className="h-4 w-4" />
                <span>Latest Episodes</span>
              </div>
              
              <h1 className="text-display-lg font-bold text-white mb-6">
                Discover Michigan's
                <br />
                <span className="text-neon-orange text-glow">Food & Culture</span>
                <br />
                Stories
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join us as we explore Michigan's vibrant food scene, cannabis culture, 
                and hidden gems through our video series.
              </p>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <a 
                  href="https://youtube.com/@dankndevour" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Subscribe on YouTube
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Episodes Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="glass-panel animate-pulse">
                    <div className="aspect-video bg-dank-black-light rounded-t-lg"></div>
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
                {episodes.map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="glass-panel hover:neon-glow transition-all duration-300 group cursor-pointer h-full"
                      onClick={() => handleEpisodeClick(episode)}
                    >
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        {episode.thumbnail ? (
                          <img 
                            src={episode.thumbnail} 
                            alt={episode.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('❌ Thumbnail failed to load:', episode.thumbnail);
                              // Try fallback thumbnail sizes
                              const videoId = episode.videoId;
                              const fallbacks = [
                                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                                `https://img.youtube.com/vi/${videoId}/default.jpg`
                              ];
                              
                              let currentSrc = e.currentTarget.src;
                              let fallbackIndex = fallbacks.findIndex(fb => currentSrc.includes(fb.split('/').pop()?.split('.')[0] || ''));
                              
                              if (fallbackIndex < fallbacks.length - 1) {
                                e.currentTarget.src = fallbacks[fallbackIndex + 1];
                                console.log('🔄 Trying fallback thumbnail:', fallbacks[fallbackIndex + 1]);
                              } else {
                                // All fallbacks failed, show placeholder
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 bg-gradient-to-br from-dank-black-light to-dank-black flex items-center justify-center ${episode.thumbnail ? 'hidden' : ''}`}>
                          <div className="relative">
                            <Play className="h-16 w-16 text-neon-orange group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-neon-orange/20 rounded-full blur-lg group-hover:bg-neon-orange/30 transition-colors"></div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <Play className="h-16 w-16 text-white drop-shadow-lg" />
                            <div className="absolute inset-0 bg-neon-orange/20 rounded-full blur-lg"></div>
                          </div>
                        </div>
                        
                        {/* Duration Badge */}
                        {episode.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {episode.duration}
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2 group-hover:text-neon-orange transition-colors line-clamp-2">
                            {episode.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {episode.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(episode.publishedAt)}</span>
                            </div>
                            {episode.viewCount && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatViewCount(episode.viewCount)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge className="bg-neon-orange/20 text-neon-orange border border-neon-orange/30 text-xs">
                              Watch Now
                            </Badge>
                            <span className="text-xs text-neon-orange group-hover:text-neon-orange-light transition-colors">
                              →
                            </span>
                          </div>
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
                Don't Miss Our Latest
                <span className="text-neon-orange"> Adventures</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to our YouTube channel for weekly episodes featuring Michigan's 
                best food spots, cannabis culture, and hidden gems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://youtube.com/@dankndevour" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Play className="h-5 w-5 mr-2" />
                    Subscribe on YouTube
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                <Link href="/munchie-map">
                  <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    Explore Map
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
