"use client";

import { motion } from "framer-motion";
import { Clock, ChefHat, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RecipesPage() {
  const comingSoonRecipes = [
    {
      id: "1",
      title: "Cannabis-Infused Chocolate Chip Cookies",
      description: "Perfectly balanced edibles with premium chocolate chips",
      prepTime: "45 min",
      difficulty: "Easy",
      rating: 4.8,
      image: "/placeholder-recipe.jpg"
    },
    {
      id: "2", 
      title: "Michigan Cherry CBD Smoothie",
      description: "Refreshing smoothie featuring local cherries and CBD",
      prepTime: "15 min",
      difficulty: "Easy",
      rating: 4.9,
      image: "/placeholder-recipe.jpg"
    },
    {
      id: "3",
      title: "Detroit-Style Pizza with Cannabis Oil",
      description: "Square pizza with crispy edges and cannabis-infused olive oil",
      prepTime: "2 hours",
      difficulty: "Advanced",
      rating: 4.7,
      image: "/placeholder-recipe.jpg"
    }
  ];

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
              <h1 className="text-4xl md:text-6xl font-black text-[#F3F3F3] mb-6">
                Dank Recipes
              </h1>
              <p className="text-xl text-[#F3F3F3]/80 mb-8">
                Coming Soon - Cannabis-infused recipes featuring Michigan's finest ingredients
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Teasers */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-black text-[#F3F3F3] mb-12 text-center">
              What's Coming
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {comingSoonRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#FF6A00]/20 to-orange-600/20 flex items-center justify-center">
                    <ChefHat className="w-16 h-16 text-[#FF6A00]" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#F3F3F3] mb-3">
                      {recipe.title}
                    </h3>
                    <p className="text-[#F3F3F3]/70 mb-4">
                      {recipe.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-[#F3F3F3]/60 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.prepTime}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {recipe.rating}
                      </div>
                    </div>
                    
                    <div className="bg-[#FF6A00]/10 text-[#FF6A00] px-3 py-1 rounded-full text-xs font-medium inline-block">
                      {recipe.difficulty}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                Stay Tuned
              </h2>
              <p className="text-xl text-[#F3F3F3]/70 mb-8">
                We're working on bringing you the best cannabis-infused recipes featuring Michigan's local ingredients. 
                Follow us for updates!
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
