"use client";

import Link from 'next/link';
import { Heart, Coffee, Star, Users, ArrowLeft, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const supportOptions = [
  {
    icon: Coffee,
    title: "Buy Me a Coffee",
    description: "Support our content creation with a one-time coffee donation.",
    amount: "$5",
    url: "https://buymeacoffee.com/dankndevour"
  },
  {
    icon: Star,
    title: "Premium Membership",
    description: "Get exclusive access to premium content and community features.",
    amount: "$9.99/month",
    url: "https://www.dankpass.com"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join our Discord community and help us grow organically.",
    amount: "Free",
    url: "https://discord.gg/dankndevour"
  },
  {
    icon: Heart,
    title: "Merchandise",
    description: "Purchase our official merchandise and show your support.",
    amount: "From $12.99",
    url: "/shop"
  }
];

const waysToHelp = [
  {
    title: "Share Our Content",
    description: "Help us reach more people by sharing our episodes and articles on social media.",
    icon: "📱"
  },
  {
    title: "Submit Recommendations",
    description: "Share your favorite Michigan food spots and cannabis dispensaries with us.",
    icon: "📍"
  },
  {
    title: "Leave Reviews",
    description: "Rate and review our content on YouTube, social media, and review platforms.",
    icon: "⭐"
  },
  {
    title: "Engage with Community",
    description: "Participate in discussions, share experiences, and help build our community.",
    icon: "💬"
  }
];

export default function SupportPage() {
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
                <Heart className="h-4 w-4" />
                <span>Support Our Mission</span>
              </div>
              
              <h1 className="text-display-lg font-bold text-white mb-6">
                Support
                <span className="text-neon-orange text-glow"> DankNDevour</span>
                <br />
                & Our Mission
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Help us continue showcasing Michigan's vibrant food scene and cannabis culture. 
                Your support enables us to create better content and grow our community.
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
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Heart className="h-4 w-4 mr-2" />
                    Join DankPass
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-sm font-bold text-white mb-4">
                Ways to Support Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the support method that works best for you. Every contribution 
                helps us continue our mission of showcasing Michigan's culture.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-panel hover:neon-glow transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-neon-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <option.icon className="h-6 w-6 text-neon-orange" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{option.title}</h3>
                            <Badge className="bg-neon-orange/20 text-neon-orange border border-neon-orange/30">
                              {option.amount}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                          <a 
                            href={option.url} 
                            target={option.url.startsWith('http') ? '_blank' : undefined}
                            rel={option.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            <Button 
                              className="w-full bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold"
                              size="sm"
                            >
                              {option.url.startsWith('http') ? (
                                <>
                                  Support Now
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                </>
                              ) : (
                                'Learn More'
                              )}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ways to Help */}
        <section className="py-16 px-4 bg-dank-black-light/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-sm font-bold text-white mb-4">
                Other Ways to Help
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                You don't need to spend money to support us. Here are free ways 
                you can help us grow and reach more people.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {waysToHelp.map((way, index) => (
                <motion.div
                  key={way.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-panel hover:neon-glow transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{way.icon}</div>
                      <h3 className="font-semibold text-white mb-2">{way.title}</h3>
                      <p className="text-sm text-muted-foreground">{way.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-display-sm font-bold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have questions about supporting us or want to collaborate? 
                We'd love to hear from you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:hello@dankndevour.com"
                  className="inline-flex items-center gap-2 text-neon-orange hover:text-neon-orange-light transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  hello@dankndevour.com
                </a>
                <a 
                  href="https://discord.gg/dankndevour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neon-orange hover:text-neon-orange-light transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Discord Community
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-dank-black via-dank-black-light to-dank-black border-t border-neon-orange/20">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-display-md font-bold text-white mb-4">
                Thank You for Your
                <span className="text-neon-orange"> Support</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every contribution, share, and interaction helps us continue our mission 
                of showcasing Michigan's incredible food and cannabis culture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Heart className="h-5 w-5 mr-2" />
                    Support Us Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                <Link href="/episodes">
                  <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    Watch Our Content
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
