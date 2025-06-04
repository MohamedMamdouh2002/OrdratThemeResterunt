import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') || 'theme.ordrat.com';
  const lang = req.headers.get('accept-language')?.includes('ar') ? 'ar' : 'en';

  const subdomain = host.split('.')[0]; // or extract from cookies
  const apiUrl = `https://testapi.ordrat.com/api/Shop/GetBySubdomain/${subdomain}`;

  const res = await fetch(apiUrl, {
    headers: { 'Accept-Language': lang },
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    return new Response('Shop not found', { status: 404 });
  }

  const shop = await res.json();

  const manifest = {
    name: lang === 'ar' ? shop.nameAr : shop.nameEn,
    short_name: lang === 'ar' ? shop.nameAr : shop.nameEn,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: shop.mainColor || '#1A73E8',
    description: lang === 'ar' ? shop.descriptionAr : shop.descriptionEn,
    icons: [
      {
        src: shop.logoUrl, // خليه رابط مباشر لصورة png
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
