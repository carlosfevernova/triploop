// S44: Itinerary Engine tipos

export type ItineraryItemType =
  | 'place' | 'meal' | 'hotel'
  | 'flight' | 'train' | 'drive' | 'walk'
  | 'event' | 'note' | 'free_time';

export type Priority = 'must' | 'preferred' | 'optional';

export interface TripDay {
  id: number;
  trip_slug: string;
  day_number: number;
  date: string | null;             // YYYY-MM-DD
  timezone: string;                // IANA
  title: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItineraryItem {
  id: number;
  trip_slug: string;
  trip_day_id: number | null;      // null = unscheduled
  position: number;
  type: ItineraryItemType;
  title: string;
  description: string | null;
  place_id: string | null;
  lat: number | null;
  lng: number | null;
  address: string | null;
  start_local: string | null;      // 'HH:MM' or 'HH:MM:SS'
  duration_min: number | null;
  priority: Priority;
  fixed: boolean;
  reservation_id: string | null;
  notes: string | null;
  source_stop_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DaySummary {
  itemsCount: number;
  totalDurationMin: number;
  scheduledCount: number;
  firstStart: string | null;
  lastEnd: string | null;
  travelMin: number;
  travelKm: number;
  warnings: DayWarning[];
}

export interface DayWarning {
  kind: 'overlap' | 'travel_conflict' | 'closed' | 'too_short' | 'dense' | 'huge_jump';
  severity: 'error' | 'warning' | 'info';
  message: string;
  itemIds: number[];
}
