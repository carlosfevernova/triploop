// S65 cache fix — wrapper para /my-trips (auth-gated dynamic)
export const dynamic = 'force-dynamic';

export default function MyTripsLayout({ children }: { children: React.ReactNode }){
  return children;
}
