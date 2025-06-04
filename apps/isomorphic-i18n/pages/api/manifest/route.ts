import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const host = req.headers.get('host') || 'theme.ordrat.com';
    const lang = req.headers.get('accept-language')?.includes('ar') ? 'ar' : 'en';


    const subdomain = host.split('.')[0];
    const apiUrl = `https://testapi.ordrat.com/api/Shop/GetBySubdomain/theme.ordrat.com`;

    try {
        const res = await fetch(apiUrl, {
            headers: { 'Accept-Language': lang },
            next: { revalidate: 5 },
        });

        if (!res.ok) {
            throw new Error('Shop not found');
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
                    src: shop.logoUrl,
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: shop.logoUrl,
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        };

        return NextResponse.json(manifest);
    } catch (error) {
        console.error('Manifest error:', error);
        return NextResponse.json(
            {
                name: 'Ordrat App',
                short_name: 'Ordrat',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#1A73E8',
                description: 'Ordrat - Your Store Companion',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            { status: 200 }
        );
    }
}
