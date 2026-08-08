import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET(){
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF5A5F 0%, #E63946 100%)',
        color: 'white', fontSize: 320, fontWeight: 700,
        fontFamily: 'system-ui', letterSpacing: '-0.05em'
      }}>t</div>
    ),
    { width: 512, height: 512 }
  );
}
