export interface Place {
  id: string;
  slug: string;
  name: string;
  address?: string;
  city?: string;
  county?: string;
  state: string;
  zip?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  cuisines: string[];
  tags: string[];
  price_level: number;
  rating?: number;
  website?: string;
  menu_url?: string;
  phone?: string;
  ig_url?: string;
  hours: Record<string, any>;
  hero_image_url?: string;
  is_featured: boolean;
  is_verified: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface MapFilters {
  counties: string[];
  cuisines: string[];
  tags: string[];
  priceRange: [number, number];
  rating: number;
  featured: boolean;
  verified: boolean;
}

export interface ClusterPoint {
  id: string;
  coordinates: [number, number];
  count: number;
  places: Place[];
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin';
}

export interface CSVImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  skipped: number;
}
