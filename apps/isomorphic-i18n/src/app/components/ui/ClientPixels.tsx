// components/client-pixels.tsx
'use client';

import React, { useEffect, useState } from 'react';
import GetPixelComponents from './pixels';
import Head from 'next/head';

export default function ClientPixels() {
  const [enabledPixels, setEnabledPixels] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPixels() {
      const shopid = process.env.NEXT_PUBLIC_SHOP_ID || '952E762C-010D-4E2B-8035-26668D99E23E';
      try {
        const res = await fetch(`https://testapi.ordrat.com/api/ShopPixel/GetAllPixelsByShopId/${shopid}`);
        const data = await res.json();
        const filtered = data.filter((pixel: any) => pixel.isEnabled && pixel.pixelCode?.trim() !== '');
        setEnabledPixels(filtered);
      } catch (err) {
        console.error('Failed to fetch pixel data:', err);
      }
    }

    fetchPixels();
  }, []);

  return (
    <>
    <Head>

      {enabledPixels.map((pixel: any) => (
          <React.Fragment key={pixel.id}>
          {GetPixelComponents(pixel)}
        </React.Fragment>
      ))}
      </Head>
    </>
  );
}
