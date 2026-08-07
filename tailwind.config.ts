import type { Config } from 'tailwindcss';

// TripLoop design system — inspired by Airbnb Cereal + Wanderlog premium
// Palette: warm neutrals + coral accent (Airbnb Rausch) + editorial typography
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        coral: {
          50: '#fff5f4',
          100: '#ffe6e3',
          200: '#ffc9c1',
          300: '#ffa094',
          400: '#ff7566',
          500: '#ff5a5f', // Airbnb Rausch
          600: '#ea4750',
          700: '#c33741',
          800: '#a02f38',
          900: '#7f2830'
        },
        // Neutrals warm (Airbnb Foggy → Hof)
        ink: {
          50: '#f7f7f7',
          100: '#ebebeb',
          200: '#dddddd',
          300: '#c2c2c2',
          400: '#8b8b8b',
          500: '#6e6e6e',
          600: '#484848', // Airbnb Hof
          700: '#333333',
          800: '#222222',
          900: '#111111'
        },
        // Ocean accent (fly-and-drive vibe)
        ocean: {
          400: '#5eb7d1',
          500: '#2e94c4',
          600: '#1f7ba8'
        }
      },
      fontFamily: {
        // Cereal-like: Inter for UI, Fraunces for hero display
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif']
      },
      fontSize: {
        // Editorial hero sizes
        'display-2xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }]
      },
      borderRadius: {
        card: '14px', // Airbnb standard
        pill: '999px'
      },
      boxShadow: {
        card: '0 6px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 28px rgba(0,0,0,0.10)',
        glow: '0 0 32px rgba(255, 90, 95, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
