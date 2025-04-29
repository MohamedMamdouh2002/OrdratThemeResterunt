'use client';

import { usePathname } from 'next/navigation';
import useClientIP from '@/app/hooks/useClientIP';
import { createContext, useContext, useEffect, useState } from 'react';
import { GeoLocationResult } from '@/types';
import { getServerShopId } from '../ui/getServerShopId';
import { useUserContext } from './UserContext';

interface TrackingContextType {
  trackAddToCart: () => void;
}

const TrackingContext = createContext<TrackingContextType>({
  trackAddToCart: () => { },
});

export const useTracking = () => useContext(TrackingContext);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const ip = useClientIP();
  const pathname = usePathname();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [addToCartCount, setAddToCartCount] = useState(0);
  const [location, setLocation] = useState<GeoLocationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { shopId } = useUserContext();
  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await fetch('/api/location');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchLocation();
  }, []);

  const deviceType = /mobile/i.test(navigator.userAgent)
    ? 'Mobile'
    : /tablet/i.test(navigator.userAgent)
      ? 'Tablet'
      : 'Desktop';

  useEffect(() => {
    let storedId = localStorage.getItem('new1ssa');
    if (!storedId) {
      storedId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('new1ssa', storedId);
    }
    setSessionId(storedId);
  }, []);

  const trackAddToCart = () => {
    setAddToCartCount((prev) => prev + 1);
  };

  useEffect(() => {
 if (!ip || !sessionId) return; 
    const checkoutPageVisited = pathname?.includes('/checkout');
    const completedOrder = pathname?.includes('/thank-you');

    console.log('📤 Sending tracking for:', {
      addToCartCount,
      checkoutPageVisited,
      completedOrder,
      pathname,
    });

    fetch('https://testapi.ordrat.com/api/Analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        shopId,
        ipAddress: location?.ip,
        deviceType,
        checkoutPageVisited,
        completedOrder,
        country: location?.country?.names?.en,
        addToCartCount,
      }),
    }).catch((error) => {
      console.error('Tracking error:', error);
    });

    setAddToCartCount(0); // تصفير العداد بعد إرسال التراك
  }, [pathname]);

  return (
    <TrackingContext.Provider value={{ trackAddToCart }}>
      {children}
    </TrackingContext.Provider>
  );
}

function isTrackablePath(pathname: string) {
  return pathname.includes('/checkout') || pathname.includes('/thank-you');
}
