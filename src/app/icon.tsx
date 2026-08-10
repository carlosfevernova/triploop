import { ImageResponse } from 'next/og';

// Next.js 15 auto-serves this at /icon and satisfies browser /favicon.ico requests.
export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon(){
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF5A5F 0%, #E63946 100%)',
        color: 'white', fontSize: 22, fontWeight: 700,
        fontFamily: 'system-ui', letterSpacing: '-0.05em',
        borderRadius: 6
      }}>t</div>
    ),
    { ...size }
  );
}
