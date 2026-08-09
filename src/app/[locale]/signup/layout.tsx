// S65 cache fix — wrapper para /signup (auth-gated dynamic)
export const dynamic = 'force-dynamic';

export default function SignupLayout({ children }: { children: React.ReactNode }){
  return children;
}
