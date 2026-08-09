// S65 cache fix — wrapper para /signin (auth-gated dynamic)
export const dynamic = 'force-dynamic';

export default function SigninLayout({ children }: { children: React.ReactNode }){
  return children;
}
