// lib/pixelService.ts

/**
 * Fetches enabled pixels from the API
 * Can be used in both server components and client components
 */
export async function getEnabledPixels() {
    const shopId = process.env.SHOP_ID || 
                   process.env.NEXT_PUBLIC_SHOP_ID || 
                   '952E762C-010D-4E2B-8035-26668D99E23E';
    
    try {
      const res = await fetch(
        `https://testapi.ordrat.com/api/ShopPixel/GetAllPixelsByShopId/${shopId}`,
        { cache: 'no-store' } // Prevent caching for fresh data
      );
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Filter enabled pixels with non-empty codes
      return data.filter((pixel: any) => 
        pixel.isEnabled && 
        pixel.pixelCode?.trim() !== ''
      );
    } catch (err) {
      console.error('Failed to fetch pixel data:', err);
      return [];
    }
  }