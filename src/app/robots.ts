import type { MetadataRoute } from 'next';

const SITE = 'https://triploop-six.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/my-trips', '/trip/*/edit']
      }
    ],
    sitemap: `${SITE}/sitemap.xml`
  };
}
