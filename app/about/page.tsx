"use client";

import Link from 'next/link';
import { MapPin, Users, Heart, Star, ArrowLeft, ExternalLink, Coffee, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const teamValues = [
  {
    icon: MapPin,
    title: "Local Discovery",
    description: "We're passionate about uncovering Michigan's hidden gems and sharing them with the world."
  },
  {
    icon: Coffee,
    title: "Food Culture",
    description: "From street food to fine dining, we celebrate Michigan's diverse culinary landscape."
  },
  {
    icon: Leaf,
    title: "Cannabis Culture",
    description: "We explore Michigan's thriving cannabis scene with respect and authenticity."
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building connections and fostering a supportive community of enthusiasts."
  }
];

const milestones = [
  {
    year: "2024",
    title: "DankNDevour Launch",
    description: "Launched our comprehensive platform showcasing Michigan's food and cannabis culture."
  },
  {
    year: "2023",
    title: "Community Building",
    description: "Started building our community of Michigan food and cannabis enthusiasts."
  },
  {
    year: "2022",
    title: "Content Creation",
    description: "Began creating video content exploring Michigan's local food scene."
  },
  {
    year: "2021",
    title: "The Journey Begins",
    description: "Started our mission to document and share Michigan's vibrant culture."
  }
];

export default function AboutPage() {
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
                <span>Our Story</span>
              </div>
              
              <h1 className="text-display-lg font-bold text-white mb-6">
                About
                <span className="text-neon-orange text-glow"> DankNDevour</span>
                <br />
                & Our Mission
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're passionate about showcasing Michigan's vibrant food scene and cannabis culture. 
                Our mission is to connect people with the best local experiences and build a community 
                of enthusiasts who share our love for Michigan's unique culture.
              </p>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link href="/join">
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Users className="h-4 w-4 mr-2" />
                    Join Our Community
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-sm font-bold text-white mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    DankNDevour was born from a simple idea: Michigan has incredible food and 
                    cannabis culture that deserves to be celebrated and shared. What started as 
                    a passion project has grown into a comprehensive platform that connects people 
                    with the best local experiences.
                  </p>
                  <p>
                    We believe that food and cannabis culture are deeply intertwined with 
                    community, creativity, and local identity. Our mission is to showcase 
                    these connections while building a supportive community of enthusiasts 
                    who share our values.
                  </p>
                  <p>
                    Through our video content, interactive map, and community features, 
                    we're creating a space where people can discover new places, share 
                    experiences, and connect with others who appreciate Michigan's unique culture.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="glass-panel neon-glow">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-neon-orange to-neon-orange-dark rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-12 w-12 text-dank-black" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Our Impact</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-neon-orange">500+</div>
                          <div className="text-sm text-muted-foreground">Places Discovered</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-neon-orange">10K+</div>
                          <div className="text-sm text-muted-foreground">Community Members</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-neon-orange">50+</div>
                          <div className="text-sm text-muted-foreground">Episodes Created</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-neon-orange">100+</div>
                          <div className="text-sm text-muted-foreground">Cities Covered</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
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
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape how we approach 
                showcasing Michigan's food and cannabis culture.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-panel hover:neon-glow transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-neon-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="h-8 w-8 text-neon-orange" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-sm font-bold text-white mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From humble beginnings to becoming Michigan's premier lifestyle hub, 
                here's how we've grown and evolved over the years.
              </p>
            </motion.div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex-1">
                    <Card className="glass-panel hover:neon-glow transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge className="bg-neon-orange text-dank-black font-semibold">
                            {milestone.year}
                          </Badge>
                          <h3 className="font-semibold text-white">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-neon-orange rounded-full flex-shrink-0"></div>
                  <div className="flex-1"></div>
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
                Join Our
                <span className="text-neon-orange"> Community</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Be part of Michigan's most passionate community of food and cannabis culture 
                enthusiasts. Together, we're building something special.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/join">
                  <Button size="lg" className="bg-neon-orange hover:bg-neon-orange-dark text-dank-black font-semibold neon-glow">
                    <Users className="h-5 w-5 mr-2" />
                    Join DankPass
                  </Button>
                </Link>
                <a 
                  href="https://www.dankpass.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                    Learn More
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
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