#!/usr/bin/env node

/**
 * Script to add restaurants from michigan_munchies_seed.json to the database
 * This script uses the existing API endpoint to add restaurants
 */

const fs = require('fs');
const path = require('path');

// Read the seed data
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../michigan_munchies_seed.json'), 'utf8'));

// Coordinates for Michigan cities (approximate)
const coordinates = {
  'Chesterfield, MI': { lat: 42.67, lng: -82.84 },
  'Shelby Township, MI': { lat: 42.67, lng: -83.03 },
  'Fort Gratiot, MI': { lat: 43.08, lng: -82.48 },
  'Lexington, MI': { lat: 43.27, lng: -82.53 },
  'Royal Oak, MI': { lat: 42.49, lng: -83.14 }
};

// Enhanced data for Lovaburger with real information
const lovaburgerEnhanced = {
  id: "05287be3-d408-4b9e-a8cf-da37b62e7107",
  name: "Lov-A Burger Grill & Cafe",
  slug: "lov-a-burger-grill-cafe-chesterfield",
  city: "Chesterfield, MI",
  type: "restaurant",
  category: "Food",
  cuisines: ["American", "Burgers"],
  address: "49660 Gratiot Ave, Chesterfield, MI 48051",
  phone: "(586) 221-1088",
  website: "http://lovaburger.letseat.at/",
  instagram: null,
  tiktok: null,
  hours: {
    "Monday": "10:00 AM - 9:00 PM",
    "Tuesday": "10:00 AM - 9:00 PM", 
    "Wednesday": "10:00 AM - 9:00 PM",
    "Thursday": "10:00 AM - 9:00 PM",
    "Friday": "10:00 AM - 9:00 PM",
    "Saturday": "10:00 AM - 9:00 PM",
    "Sunday": "11:00 AM - 8:00 PM"
  },
  geocode: {
    lat: 42.67,
    lng: -82.84,
    place_id: null
  },
  tags: [
    "Michigan Munchie Map",
    "Featured Restaurant",
    "Local Favorite",
    "Hand-cut Fries",
    "Fresh Ingredients"
  ],
  status: "published",
  notes: "Featured restaurant with excellent burgers and hand-cut fries. Local favorite with great service.",
  source: "verified",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_featured: true,
  is_verified: true,
  rating: 4.5,
  price_level: 2
};

// Function to convert seed data to API format
function convertToApiFormat(restaurant) {
  const coords = coordinates[restaurant.city] || { lat: 42.33, lng: -83.05 }; // Default to Detroit area
  
  return {
    name: restaurant.name,
    slug: restaurant.slug,
    address: restaurant.address || null,
    city: restaurant.city.split(',')[0], // Remove ", MI" part
    county: getCountyFromCity(restaurant.city),
    state: 'MI',
    zip: null,
    location: {
      type: 'Point',
      coordinates: [coords.lng, coords.lat] // [longitude, latitude] for PostGIS
    },
    cuisines: restaurant.cuisines || [],
    tags: restaurant.tags || [],
    price_level: restaurant.price_level || 2,
    rating: restaurant.rating || null,
    website: restaurant.website || null,
    phone: restaurant.phone || null,
    ig_url: restaurant.instagram || null,
    hours: restaurant.hours || {},
    hero_image_url: null,
    is_featured: restaurant.is_featured || false,
    is_verified: restaurant.is_verified || false,
    status: restaurant.status === 'pending_verification' ? 'published' : restaurant.status || 'published'
  };
}

// Helper function to get county from city
function getCountyFromCity(city) {
  const countyMap = {
    'Chesterfield': 'Macomb',
    'Shelby Township': 'Macomb', 
    'Fort Gratiot': 'St. Clair',
    'Lexington': 'Sanilac',
    'Royal Oak': 'Oakland'
  };
  
  const cityName = city.split(',')[0];
  return countyMap[cityName] || 'Unknown';
}

// Main function to add restaurants
async function addRestaurants() {
  console.log('🍔 Adding restaurants to Michigan Munchie Map...\n');
  
  // Add Lovaburger first with enhanced data
  console.log('1. Adding Lov-A Burger Grill & Cafe (Featured)...');
  const lovaburgerData = convertToApiFormat(lovaburgerEnhanced);
  
  try {
    const response = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ingest-Key': process.env.INGEST_API_KEY || 'supersecret'
      },
      body: JSON.stringify(lovaburgerData)
    });
    
    if (response.ok) {
      console.log('✅ Lov-A Burger added successfully!');
    } else {
      console.log('❌ Failed to add Lov-A Burger:', await response.text());
    }
  } catch (error) {
    console.log('❌ Error adding Lov-A Burger:', error.message);
  }
  
  // Add other restaurants
  const otherRestaurants = seedData.filter(r => r.name !== 'Lovaburger');
  
  for (let i = 0; i < otherRestaurants.length; i++) {
    const restaurant = otherRestaurants[i];
    console.log(`${i + 2}. Adding ${restaurant.name}...`);
    
    const apiData = convertToApiFormat(restaurant);
    
    try {
      const response = await fetch('http://localhost:3000/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ingest-Key': process.env.INGEST_API_KEY || 'supersecret'
        },
        body: JSON.stringify(apiData)
      });
      
      if (response.ok) {
        console.log(`✅ ${restaurant.name} added successfully!`);
      } else {
        console.log(`❌ Failed to add ${restaurant.name}:`, await response.text());
      }
    } catch (error) {
      console.log(`❌ Error adding ${restaurant.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Restaurant import completed!');
  console.log('💡 Make sure your development server is running (npm run dev)');
  console.log('💡 Check your .env.local file for the INGEST_API_KEY');
}

// Run the script
if (require.main === module) {
  addRestaurants().catch(console.error);
}

module.exports = { addRestaurants, convertToApiFormat };
