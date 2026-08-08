export const metadata = {
  robots: { index: false, follow: false }
};

export default function EmbedRootLayout({ children }: { children: React.ReactNode }){
  // Passthrough — cada embed page tiene su propio <html>
  return children;
}
