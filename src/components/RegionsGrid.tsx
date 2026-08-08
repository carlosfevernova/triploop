'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const REGIONS = [
  {
    slug: 'california', name_en: 'California', name_es: 'California',
    subtitle_en: 'PCH, Yosemite, Napa', subtitle_es: 'PCH, Yosemite, Napa',
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&auto=format&fit=crop',
    trips: 8
  },
  {
    slug: 'nevada', name_en: 'Nevada', name_es: 'Nevada',
    subtitle_en: 'Vegas, Tahoe, Highway 50', subtitle_es: 'Vegas, Tahoe, Highway 50',
    image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&auto=format&fit=crop',
    trips: 3
  },
  {
    slug: 'arizona', name_en: 'Arizona', name_es: 'Arizona',
    subtitle_en: 'Grand Canyon, Sedona', subtitle_es: 'Grand Canyon, Sedona',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop',
    trips: 3
  },
  {
    slug: 'utah', name_en: 'Utah', name_es: 'Utah',
    subtitle_en: 'Mighty 5, Zion, Bryce', subtitle_es: 'Mighty 5, Zion, Bryce',
    image: 'https://images.unsplash.com/photo-1518533954129-7774297db60a?w=800&auto=format&fit=crop',
    trips: 4
  },
  {
    slug: 'southwest', name_en: 'US Southwest', name_es: 'Suroeste USA',
    subtitle_en: 'Grand Circle, Route 66', subtitle_es: 'Grand Circle, Route 66',
    image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=800&auto=format&fit=crop',
    trips: 2
  },
  {
    slug: 'spain', name_en: 'Spain 🇪🇸', name_es: 'España 🇪🇸',
    subtitle_en: 'Madrid, Barcelona, Andalucía', subtitle_es: 'Madrid, Barcelona, Andalucía',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&auto=format&fit=crop',
    trips: 4
  },
  {
    slug: 'pacific-northwest', name_en: 'Pacific Northwest', name_es: 'Pacific Northwest',
    subtitle_en: 'Seattle, Portland, Olympic', subtitle_es: 'Seattle, Portland, Olympic',
    image: 'https://images.unsplash.com/photo-1502175353174-a7a1a03b1b7e?w=800&auto=format&fit=crop',
    trips: 2
  },
  {
    slug: 'northeast', name_en: 'Northeast USA', name_es: 'Noreste USA',
    subtitle_en: 'New England foliage, Blue Ridge', subtitle_es: 'Otoño New England, Blue Ridge',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    trips: 2
  },
  {
    slug: 'southeast', name_en: 'Southeast USA', name_es: 'Sureste USA',
    subtitle_en: 'Florida Keys, Mississippi River', subtitle_es: 'Florida Keys, Mississippi',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop',
    trips: 2
  },
  {
    slug: 'rockies', name_en: 'Rocky Mountains', name_es: 'Rocosas',
    subtitle_en: 'Glacier, Yellowstone, Grand Teton', subtitle_es: 'Glacier, Yellowstone, Grand Teton',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
    trips: 2
  },
  {
    slug: 'italy', name_en: 'Italy 🇮🇹', name_es: 'Italia 🇮🇹',
    subtitle_en: 'Amalfi SS163, Cinque Terre, Tuscany', subtitle_es: 'Amalfi SS163, Cinque Terre, Toscana',
    image: 'https://images.unsplash.com/photo-1533904333078-4c0d040e6c22?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'iceland', name_en: 'Iceland 🇮🇸', name_es: 'Islandia 🇮🇸',
    subtitle_en: 'Ring Road 1,322 km, Jökulsárlón', subtitle_es: 'Ring Road 1,322 km, Jökulsárlón',
    image: 'https://images.unsplash.com/photo-1490650034439-fd184c3c86a5?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'ireland', name_en: 'Ireland 🇮🇪', name_es: 'Irlanda 🇮🇪',
    subtitle_en: 'Ring of Kerry N70, Cliffs of Moher', subtitle_es: 'Ring of Kerry N70, Cliffs of Moher',
    image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'australia', name_en: 'Australia 🇦🇺', name_es: 'Australia 🇦🇺',
    subtitle_en: 'Great Ocean Road B100', subtitle_es: 'Great Ocean Road B100',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'new-zealand', name_en: 'New Zealand 🇳🇿', name_es: 'Nueva Zelanda 🇳🇿',
    subtitle_en: 'South Island Milford Sound', subtitle_es: 'Isla Sur Milford Sound',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'germany', name_en: 'Germany 🇩🇪', name_es: 'Alemania 🇩🇪',
    subtitle_en: 'Romantic Road B25, Neuschwanstein', subtitle_es: 'Ruta Romántica B25, Neuschwanstein',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'mexico', name_en: 'Mexico 🇲🇽', name_es: 'México 🇲🇽',
    subtitle_en: 'Riviera Maya, Chichén Itzá, Cenotes', subtitle_es: 'Riviera Maya, Chichén Itzá, Cenotes',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'chile', name_en: 'Chile 🇨🇱', name_es: 'Chile 🇨🇱',
    subtitle_en: 'Carretera Austral Ruta 7', subtitle_es: 'Carretera Austral Ruta 7',
    image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'argentina', name_en: 'Argentina 🇦🇷', name_es: 'Argentina 🇦🇷',
    subtitle_en: 'Ruta 40, Bariloche, Perito Moreno', subtitle_es: 'Ruta 40, Bariloche, Perito Moreno',
    image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'peru', name_en: 'Peru 🇵🇪', name_es: 'Perú 🇵🇪',
    subtitle_en: 'Sacred Valley, Machu Picchu', subtitle_es: 'Valle Sagrado, Machu Picchu',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'japan', name_en: 'Japan 🇯🇵', name_es: 'Japón 🇯🇵',
    subtitle_en: 'Golden Route Tokyo→Kyoto→Osaka', subtitle_es: 'Ruta Dorada Tokio→Kioto→Osaka',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'canada', name_en: 'Canada 🇨🇦', name_es: 'Canadá 🇨🇦',
    subtitle_en: 'Icefields Parkway Hwy 93', subtitle_es: 'Icefields Parkway Hwy 93',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'scotland', name_en: 'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿', name_es: 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    subtitle_en: 'North Coast 500 (NC500) Highlands', subtitle_es: 'North Coast 500 (NC500) Highlands',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    trips: 1
  },
  {
    slug: 'morocco', name_en: 'Morocco 🇲🇦', name_es: 'Marruecos 🇲🇦',
    subtitle_en: 'Marrakech Atlas Sahara Merzouga', subtitle_es: 'Marrakech Atlas Sahara Merzouga',
    image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=800&auto=format&fit=crop',
    trips: 1
  }
];

export function RegionsGrid(){
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const isEs = locale === 'es';
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Explora por región' : 'Explore by region'}
          </p>
          <h2 className="font-display text-display-lg text-ink-900 text-balance">
            {isEs ? 'Road trips icónicos del mundo' : 'Iconic road trips around the world'}
          </h2>
          <p className="mt-3 text-lg text-ink-500">
            {isEs ? '46 rutas curadas · 24 regiones · 7 continentes · desde Alaska hasta Sahara' : '46 curated itineraries · 24 regions · 7 continents · from Alaska to Sahara'}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <Link
              key={r.slug}
              href={`/${locale}/${r.slug}`}
              prefetch
              className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink-200 shadow-card transition hover:shadow-card-hover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.image}
                alt={r.name_en}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/30 to-transparent" />
              <span className="absolute right-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-800 backdrop-blur">
                {r.trips} {isEs ? 'rutas' : 'trips'}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-2xl font-semibold">
                  {isEs ? r.name_es : r.name_en}
                </h3>
                <p className="mt-1 text-sm text-white/85">{isEs ? r.subtitle_es : r.subtitle_en}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
