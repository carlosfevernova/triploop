// S47 Fase 34: Client-side helper para analytics events (fire-and-forget via sendBeacon).

const SESSION_KEY = 'triploop_itin_session';

function getSessionId(): string {
  if(typeof sessionStorage === 'undefined') return '';
  let sid = sessionStorage.getItem(SESSION_KEY);
  if(!sid){
    sid = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export type ItineraryEvent =
  | 'itinerary_viewed' | 'day_selected' | 'item_added' | 'item_removed' | 'item_moved'
  | 'item_time_changed' | 'item_duration_changed' | 'route_viewed' | 'route_optimized'
  | 'day_auto_scheduled' | 'ai_edit_applied' | 'schedule_warning_shown' | 'schedule_warning_resolved'
  | 'item_undo' | 'ai_edit_requested';

export function trackItinerary(slug: string, event: ItineraryEvent, props?: Record<string, unknown>){
  if(typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({ trip_slug: slug, event, props, session_id: getSessionId() });
    if(navigator.sendBeacon){
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/itinerary', blob);
    } else {
      fetch('/api/analytics/itinerary', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  } catch { /* silent */ }
}
