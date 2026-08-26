import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TripLoop — AI road-trip planner · 27,897 LOC · 24 regions · 4 native locales · For sale';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG(){
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0b1220 0%, #1a2942 55%, #274069 100%)',
        color: '#f9fafb',
        padding: '72px',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: '#0b1220',
          }}>T</div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>TripLoop</div>
          <div style={{
            marginLeft: 'auto',
            fontSize: 20,
            fontWeight: 600,
            padding: '10px 20px',
            background: '#f59e0b',
            color: '#0b1220',
            borderRadius: 999,
          }}>FOR SALE · $35K</div>
        </div>

        <div style={{
          display: 'flex',
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginTop: 40,
          maxWidth: 1000,
        }}>
          AI road-trip planner SaaS
        </div>

        <div style={{
          display: 'flex',
          fontSize: 32,
          fontWeight: 400,
          lineHeight: 1.3,
          color: '#cbd5e1',
          marginTop: 24,
          maxWidth: 1000,
        }}>
          Next.js 15 · Supabase · Stripe · Multi-provider AI · PWA · 4 native locales
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 'auto', paddingTop: 40 }}>
          <Metric value="27,897" label="LOC TypeScript" />
          <Metric value="51" label="API endpoints" />
          <Metric value="25" label="Supabase migrations" />
          <Metric value="231" label="Curated POIs" />
          <Metric value="24" label="Regions" />
          <Metric value="4" label="Native locales" />
        </div>

        <div style={{
          display: 'flex',
          fontSize: 22,
          color: '#94a3b8',
          marginTop: 32,
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex' }}>github.com/carlosfevernova/triploop</div>
          <div style={{ display: 'flex' }}>71 sprints · 117 commits · MIT</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

function Metric({ value, label }: { value: string; label: string }){
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 16, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
    </div>
  );
}
