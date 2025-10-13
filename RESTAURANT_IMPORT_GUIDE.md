# Restaurant Import Guide

This guide explains how to add the restaurants from `michigan_munchies_seed.json` to your Michigan Munchie Map project.

## 🍔 Featured Restaurant: Lov-A Burger Grill & Cafe

**Lov-A Burger Grill & Cafe** has been set up as the featured restaurant with:
- Complete address: 49660 Gratiot Ave, Chesterfield, MI 48051
- Phone: (586) 221-1088
- Website: http://lovaburger.letseat.at/
- Rating: 4.5 stars
- Hours: Mon-Sat 10AM-9PM, Sun 11AM-8PM
- Specialties: Hand-cut fries, fresh ingredients, local favorite

## 📋 Restaurants to Import

The following restaurants are ready to be added:

1. **Lov-A Burger Grill & Cafe** (Chesterfield, MI) - **FEATURED**
2. **Pink Garlic** (Shelby Township, MI) - Indian cuisine
3. **Fort Gratiot Nutrition** (Fort Gratiot, MI) - Smoothies & drinks
4. **Lexington Nutrition** (Lexington, MI) - Smoothies & drinks  
5. **Pizza de Palazoo** (Royal Oak, MI) - Pizza & Italian

## 🚀 How to Import

### Option 1: CSV Import (Recommended)

1. Use the provided `restaurants-import.csv` file
2. Go to your admin panel at `/admin/import`
3. Upload the CSV file
4. Review and confirm the import

### Option 2: API Import

1. Start your development server: `npm run dev`
2. Set up your environment variables in `.env.local`:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   INGEST_API_KEY=supersecret
   ```
3. Run the import script: `node scripts/add-seed-restaurants.js`

### Option 3: Direct Database Import

1. Set up your Supabase project
2. Update the environment variables in `scripts/add-restaurants-direct.js`
3. Run: `node scripts/add-restaurants-direct.js`

## 🎯 Homepage Features

The homepage has been updated to prominently feature Lov-A Burger Grill & Cafe with:
- Hero section with gradient background
- Restaurant details and highlights
- Call-to-action buttons
- Links to featured restaurants page

## 📍 Coordinates Used

- Chesterfield, MI: 42.67, -82.84
- Shelby Township, MI: 42.67, -83.03
- Fort Gratiot, MI: 43.08, -82.48
- Lexington, MI: 43.27, -82.53
- Royal Oak, MI: 42.49, -83.14

## ✅ Next Steps

1. Import the restaurants using one of the methods above
2. Verify the restaurants appear on the map
3. Check that Lov-A Burger appears as featured
4. Test the homepage hero section
5. Visit the featured restaurants page

## 🔧 Troubleshooting

- Make sure your Supabase project has the PostGIS extension enabled
- Verify your environment variables are set correctly
- Check that the database schema matches the expected format
- Ensure the development server is running for API imports

## 📞 Support

If you encounter any issues, check the console logs and verify your Supabase configuration.
