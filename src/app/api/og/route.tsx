import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Vercel OG dinámica: 1200x630 con branding TripLoop.
// Uso: /api/og?title=San+Francisco+Classic+5+days&days=5
export async function GET(req: Request){
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Your California road trip.';
    const days = searchParams.get('days');
    const stops = searchParams.get('stops');

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px',
            background: 'linear-gradient(135deg, #FF5A5F 0%, #E63946 55%, #1F2937 100%)',
            color: 'white',
            fontFamily: 'system-ui'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: 'white',
                color: '#FF5A5F',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 700
              }}
            >
              t
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>TripLoop</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                maxWidth: 1000
              }}
            >
              {title}
            </div>
            <div style={{ display: 'flex', gap: 16, opacity: 0.85, fontSize: 22 }}>
              {days ? <div>· {days} days</div> : null}
              {stops ? <div>· {stops} stops</div> : null}
              <div>· real drive times · tax-included</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 20, opacity: 0.9 }}>
            <div>Smart California road trips for international travelers</div>
            <div style={{ fontWeight: 600 }}>triploop.app</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response('OG generation failed', { status: 500 });
  }
}
