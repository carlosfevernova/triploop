import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Maskable: safe zone 40% central; padding externo del gradient
export function GET(){
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FF5A5F',
        color: 'white', fontSize: 240, fontWeight: 700,
        fontFamily: 'system-ui', letterSpacing: '-0.05em'
      }}>t</div>
    ),
    { width: 512, height: 512 }
  );
}
