import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

// OpenChargeMap API: gratis 500 req/día sin key. Con key OPENCHARGEMAP_KEY sube límite.
// Docs: https://openchargemap.org/site/develop/api

interface Body {
  lat: number;
  lng: number;
  radiusKm?: number;      // default 25
  maxResults?: number;    // default 15
}

interface OCMPoi {
  ID: number;
  AddressInfo?: {
    Title?: string;
    AddressLine1?: string;
    Town?: string;
    Latitude?: number;
    Longitude?: number;
    Distance?: number;
  };
  OperatorInfo?: { Title?: string };
  NumberOfPoints?: number;
  StatusType?: { IsOperational?: boolean };
  Connections?: Array<{
    ConnectionType?: { Title?: string };
    PowerKW?: number;
    Level?: { Title?: string };
  }>;
}

export interface EVChargerResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance_km: number;
  operator: string;
  connectors: number;
  max_power_kw: number;
  connector_types: string[];
  operational: boolean;
}

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 20, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    if(typeof body.lat !== 'number' || typeof body.lng !== 'number'){
      return NextResponse.json({ error: 'lat_lng_required' }, { status: 400 });
    }
    const radius = Math.min(100, Math.max(1, body.radiusKm || 25));
    const max = Math.min(50, Math.max(1, body.maxResults || 15));

    const params = new URLSearchParams({
      output: 'json',
      countrycode: 'US,ES,MX,CA,GB,FR,IT,DE',
      latitude: body.lat.toString(),
      longitude: body.lng.toString(),
      distance: radius.toString(),
      distanceunit: 'km',
      maxresults: max.toString(),
      compact: 'true',
      verbose: 'false'
    });
    const key = process.env.OPENCHARGEMAP_KEY;
    if(key) params.set('key', key);

    const r = await fetch(`https://api.openchargemap.io/v3/poi/?${params.toString()}`, {
      headers: { 'user-agent': 'TripLoop/1.0 (contact@triploop.app)' }
    });
    if(!r.ok){
      return NextResponse.json({ error: 'ocm_failed', detail: (await r.text()).slice(0,200) }, { status: 502 });
    }
    const pois = (await r.json()) as OCMPoi[];

    const chargers: EVChargerResult[] = pois
      .filter(p => p.AddressInfo?.Latitude && p.AddressInfo?.Longitude)
      .map(p => {
        const maxPower = Math.max(0, ...(p.Connections || []).map(c => c.PowerKW || 0));
        const types = [...new Set((p.Connections || []).map(c => c.ConnectionType?.Title).filter((t): t is string => !!t))];
        return {
          id: `ocm:${p.ID}`,
          name: p.AddressInfo?.Title || 'EV Charger',
          address: [p.AddressInfo?.AddressLine1, p.AddressInfo?.Town].filter(Boolean).join(', '),
          lat: p.AddressInfo!.Latitude!,
          lng: p.AddressInfo!.Longitude!,
          distance_km: Math.round((p.AddressInfo?.Distance || 0) * 10) / 10,
          operator: p.OperatorInfo?.Title || 'Unknown',
          connectors: p.NumberOfPoints || (p.Connections?.length || 0),
          max_power_kw: Math.round(maxPower),
          connector_types: types.slice(0, 3),
          operational: p.StatusType?.IsOperational !== false
        };
      });

    return NextResponse.json({ chargers, count: chargers.length, radius_km: radius });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
