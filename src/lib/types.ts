// Tipos compartidos frontend/backend

export type UnitSystem = 'metric' | 'imperial';
export type Currency = 'USD' | 'EUR' | 'MXN' | 'GBP' | 'CAD' | 'AUD';

export interface TripStop {
  id: string;              // client-generated uuid
  name: string;            // "Golden Gate Bridge"
  address?: string;
  lat: number;
  lng: number;
  place_id?: string;       // Google Places place_id
  day?: number;            // day number (1-N) or null (unassigned)
  duration_min?: number;   // suggested time to spend
  category?: 'city' | 'attraction' | 'nature' | 'food' | 'hotel' | 'other';
  photo_url?: string;
  notes?: string;
  // Enriched (from /api/places/enrich):
  rating?: number;
  user_ratings_total?: number;
  phone?: string;
  website?: string;
  opening_hours?: Record<string, unknown> | null;
  price_level?: number;
}

export interface RouteLeg {
  from_stop_id: string;
  to_stop_id: string;
  distance_m: number;
  duration_s: number;
  duration_traffic_s?: number;
  polyline?: string;       // encoded polyline
}

export interface Trip {
  id: string;
  slug: string;
  title: string;
  description?: string;
  origin_city?: string;
  destination_city?: string;
  start_date?: string;
  end_date?: string;
  days_count: number;
  travelers_count: number;
  unit_system: UnitSystem;
  currency: Currency;
  locale: string;
  stops: TripStop[];
  route_geometry?: { legs: RouteLeg[]; total_distance_m: number; total_duration_s: number };
  total_distance_m?: number;
  total_duration_s?: number;
  is_public: boolean;
  owner_id?: string;
  region?: string;
  created_at: string;
  updated_at: string;
}

export interface PlaceSuggestion {
  place_id: string;
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
  types?: string[];
  photo_url?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
}
