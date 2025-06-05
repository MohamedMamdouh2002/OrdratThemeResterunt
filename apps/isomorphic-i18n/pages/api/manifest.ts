// pages/manifest.json.ts

import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchSubdomain(subdomain: string, lang: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetBySubdomain/${subdomain}`,
      {
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch subdomain data');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching subdomain:', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lang = (req.query.lang as string) || 'en';
    const subdomain = (req.query.subdomain as string) || 'default';

    const shopData = await fetchSubdomain(subdomain, lang);

    const manifest = {
      name: shopData?.nameAr ,
      short_name: shopData?.nameAr ,
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      description:
        lang === 'ar'
          ? `${shopData?.name || 'أوردرات'} - رفيق متجرك`
          : `${shopData?.name || 'Ordrat'} - Your Store Companion`,
      icons: [
        {
          src: shopData?.logoUrl ,
          sizes: '192x192',
           },
        {
          src: shopData?.logoUrl,
          sizes: '512x512',
          },
      ],
    };

    res.setHeader('Content-Type', 'application/manifest+json');
    res.status(200).json(manifest);
  } catch (err) {
    console.error('Manifest error:', err);
    res.writeHead(500).end('Internal Server Error');
  }
}
