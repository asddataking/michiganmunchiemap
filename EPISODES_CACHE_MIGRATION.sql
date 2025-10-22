-- Migration: Create episodes_cache table for YouTube video caching
-- This reduces YouTube API calls and quota usage
-- Run this in your Supabase SQL Editor

-- Create episodes_cache table
CREATE TABLE IF NOT EXISTS episodes_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL,
  episodes_data jsonb NOT NULL,
  episodes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Add index on expires_at for faster cleanup queries
CREATE INDEX IF NOT EXISTS idx_episodes_cache_expires_at ON episodes_cache(expires_at);

-- Add index on cache_key
CREATE INDEX IF NOT EXISTS idx_episodes_cache_key ON episodes_cache(cache_key);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_episodes_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER episodes_cache_updated_at
  BEFORE UPDATE ON episodes_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_episodes_cache_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE episodes_cache ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow service role to do everything
CREATE POLICY "Service role can manage episodes cache"
  ON episodes_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read cache
CREATE POLICY "Authenticated users can read episodes cache"
  ON episodes_cache
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anon users to read cache (for public API endpoints)
CREATE POLICY "Anonymous users can read episodes cache"
  ON episodes_cache
  FOR SELECT
  TO anon
  USING (true);

-- Add comment
COMMENT ON TABLE episodes_cache IS 'Cache table for YouTube episodes/videos to reduce API calls';

