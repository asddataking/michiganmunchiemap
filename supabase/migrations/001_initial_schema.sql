-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create places table
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
  price_level int DEFAULT 2 CHECK (price_level >= 1 AND price_level <= 4),
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  website text,
  menu_url text,
  phone text,
  ig_url text,
  hours jsonb DEFAULT '{}'::jsonb,
  hero_image_url text,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_places_location ON places USING GIST (location);
CREATE INDEX idx_places_tags ON places USING GIN (tags);
CREATE INDEX idx_places_cuisines ON places USING GIN (cuisines);
CREATE INDEX idx_places_slug ON places (slug);
CREATE INDEX idx_places_status ON places (status);
CREATE INDEX idx_places_county ON places (county);
CREATE INDEX idx_places_city ON places (city);
CREATE INDEX idx_places_featured ON places (is_featured);
CREATE INDEX idx_places_verified ON places (is_verified);
CREATE INDEX idx_places_rating ON places (rating);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to read published places
CREATE POLICY "Allow public read access to published places"
  ON places FOR SELECT
  USING (status = 'published');

-- Allow authenticated users with admin role to do everything
CREATE POLICY "Allow admin full access"
  ON places FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = ANY(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = ANY(string_to_array(current_setting('app.admin_emails', true), ','))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('place-images', 'place-images', true);

-- Create storage policies
CREATE POLICY "Allow public read access to place images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'place-images');

CREATE POLICY "Allow admin upload to place images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'place-images' 
    AND is_admin()
  );

CREATE POLICY "Allow admin update to place images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'place-images' 
    AND is_admin()
  );

CREATE POLICY "Allow admin delete from place images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'place-images' 
    AND is_admin()
  );
