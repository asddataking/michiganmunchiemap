# Michigan Munchies

A map-first food directory for Michigan built with Next.js 15, MapLibre GL, and Supabase.

## 🧩 Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind + shadcn/ui
- **Backend**: Supabase Postgres + PostGIS (via Supabase JS SDK)
- **Map**: MapLibre GL JS (MapTiler tiles, fallback Mapbox)
- **Auth**: Supabase Auth (admin-only authentication)
- **Storage**: Supabase Storage (for hero images)
- **Hosting**: Vercel

## 🚀 Features

- **Interactive Map**: MapLibre GL with clustering and filtering
- **Split View**: Map + list view with real-time filtering
- **Geo Queries**: "Near Me" and bounding-box filtering using PostGIS
- **Detail Pages**: Full SEO with OG tags and JSON-LD structured data
- **Admin Panel**: Protected dashboard with CRUD operations
- **CSV Import**: Bulk import functionality for places
- **API Endpoints**: RESTful API for places and ingest endpoint

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- Supabase project with PostGIS extension
- MapTiler API key (or Mapbox access token)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd michiganmunchiemap
   npm install
   ```

2. **Set up Supabase**
   
   Create a Supabase project and get your credentials from the project settings.

3. **Environment Variables**
   
   Create `.env.local`:
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://michiganmunchies.com
   
   # Authentication (Supabase Auth)
   # No additional auth configuration needed
   
   # Map Configuration
   NEXT_PUBLIC_MAPTILER_KEY=your-maptiler-key
   NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN=your-mapbox-public-token
   
   # Admin Configuration
   NEXT_PUBLIC_ADMIN_EMAILS=you@dankndevour.com,dan@dankpass.com
   
   # API Configuration
   INGEST_API_KEY=supersecret
   ```

4. **Database Setup**
   
   Run the SQL migration in your Supabase project:
   ```sql
   -- See supabase/migrations/001_initial_schema.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses a single `places` table with PostGIS for geospatial queries:

```sql
CREATE TABLE places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  address text,
  city text,
  county text,
  state text DEFAULT 'MI',
  zip text,
  location geography(Point,4326) NOT NULL,
  cuisines text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  price_level int DEFAULT 2,
  rating numeric,
  website text,
  menu_url text,
  phone text,
  ig_url text,
  hours jsonb DEFAULT '{}'::jsonb,
  hero_image_url text,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔐 Supabase Usage

All database operations use the Supabase JS SDK:

```typescript
import { PlacesService } from '@/lib/supabase';

// Get places within bounds
const places = await PlacesService.getPlacesInBounds(minLng, minLat, maxLng, maxLat);

// Search places with filters
const places = await PlacesService.searchPlaces(searchTerm, filters);

// Upsert place data
const place = await PlacesService.upsertPlace(placeData);
```

## 🌍 API Endpoints

### GET /api/places
Query places with optional filters:
- `bbox` - Bounding box (minLng,minLat,maxLng,maxLat)
- `search` - Search term
- `counties`, `cuisines`, `tags` - Filter arrays
- `priceMin`, `priceMax` - Price range
- `minRating` - Minimum rating
- `featured`, `verified` - Boolean filters

### POST /api/ingest
Server-to-server upsert endpoint:
- Requires `X-Ingest-Key` header
- Accepts place data in request body
- Returns created/updated place

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── place/[slug]/      # Place detail pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── filters/           # Filter components
│   ├── layout/            # Layout components
│   ├── map/               # Map components
│   ├── places/            # Place components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and MCP client
├── supabase/              # Database migrations
├── types/                 # TypeScript types
└── .cursor/               # MCP configuration
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables**
   - Add all variables from `.env.local` to Vercel dashboard
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain

3. **Deploy**
   ```bash
   git push origin main
   ```

### Environment Variables for Production

Ensure these are set in your Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADMIN_EMAILS`
- `NEXT_PUBLIC_MAPTILER_KEY` or `NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN`
- `INGEST_API_KEY`

## 📊 CSV Import Format

Download the template CSV from the admin panel or use this format:

```csv
name,address,city,county,state,zip,latitude,longitude,cuisines,tags,price_level,rating,website,phone,ig_url,is_featured,is_verified
Example Restaurant,123 Main St,Detroit,Wayne,MI,48201,42.3314,-83.0458,"American,Burgers","Outdoor Seating,Family Friendly",2,4.5,https://example.com,313-555-0123,https://instagram.com/example,false,true
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Supabase Integration

The project uses the Supabase JS SDK for database operations. All database interactions are handled through the `PlacesService` class which provides a clean, typed interface for common operations.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email hello@michiganmunchies.com or create an issue in the repository.
