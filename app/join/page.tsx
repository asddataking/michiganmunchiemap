"use client";

import Link from 'next/link';
import { Users, Star, Heart, ExternalLink, ArrowLeft, Check, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const membershipBenefits = [
  {
    icon: Star,
    title: "Exclusive Content",
    description: "Access to premium episodes, behind-the-scenes content, and member-only videos."
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Be the first to watch new episodes and get early access to merchandise drops."
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Join our private Discord community and connect with fellow Michigan food enthusiasts."
  },
  {
    icon: Crown,
    title: "VIP Events",
    description: "Invitations to exclusive meetups, food tours, and cannabis culture events."
  }
];

const membershipTiers = [
  {
    name: "Basic",
    price: 4.99,
    period: "month",
    description: "Perfect for casual fans",
    features: [
      "Access to premium episodes",
      "Community Discord access",
      "Monthly newsletter",
      "Early merchandise access"
    ],
    popular: false
  },
  {
    name: "Premium",
    price: 9.99,
    period: "month",
    description: "For dedicated supporters",
    features: [
      "Everything in Basic",
      "Behind-the-scenes content",
      "Exclusive live streams",
      "Priority customer support",
      "Member-only merchandise"
    ],
    popular: true
  },
  {
    name: "VIP",
    price: 19.99,
    period: "month",
    description: "Ultimate fan experience",
    features: [
      "Everything in Premium",
      "VIP event invitations",
      "Personalized recommendations",
      "Direct creator access",
      "Limited edition merchandise"
    ],
    popular: false
  }
];

export default function JoinPage() {
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
                <Users className="h-4 w-4" />
                <span>Join Our Community</span>
              </div>
              
              <h1 className="text-display-lg font-bold text-white mb-6">
                Join the
                <span className="text-neon-orange text-glow"> DankPass</span>
                <br />
                Community
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Become part of Michigan's premier food and cannabis culture community. 
                Get exclusive access to content, events, and connect with like-minded enthusiasts.
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
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
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
                Why Join DankPass?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get exclusive access to premium content, connect with the community, 
                and support our mission to showcase Michigan's vibrant culture.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {membershipBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-panel hover:neon-glow transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-neon-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="h-8 w-8 text-neon-orange" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
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
                Choose Your Membership
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the membership tier that best fits your level of engagement 
                with Michigan's food and cannabis culture.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`glass-panel transition-all duration-300 h-full relative ${
                    tier.popular ? 'neon-glow border-neon-orange/50' : 'hover:neon-glow'
                  }`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-neon-orange text-dank-black font-semibold px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl font-bold text-white">{tier.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-neon-orange">${tier.price}</span>
                        <span className="text-muted-foreground">/{tier.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-neon-orange flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <a 
                        href="https://www.dankpass.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button 
                          className={`w-full ${
                            tier.popular
                              ? 'bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold'
                              : 'bg-dank-black-light hover:bg-dank-black-lighter text-white border border-neon-orange/30'
                          }`}
                        >
                          Choose {tier.name}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
                Ready to Join the
                <span className="text-neon-orange"> Community</span>?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start your journey with Michigan's most passionate food and cannabis culture 
                community. Join thousands of members who share your interests.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Users className="h-5 w-5 mr-2" />
                    Join DankPass Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                <Link href="/episodes">
                  <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    Watch Episodes First
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
