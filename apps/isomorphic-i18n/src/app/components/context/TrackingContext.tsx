'use client';

import { usePathname } from 'next/navigation';
import useClientIP from '@/app/hooks/useClientIP';
import { createContext, useContext, useEffect, useState } from 'react';

interface TrackingContextType {
  trackAddToCart: () => void;
}

const TrackingContext = createContext<TrackingContextType>({
  trackAddToCart: () => {},
});

export const useTracking = () => useContext(TrackingContext);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const ip = useClientIP();
  const pathname = usePathname();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [addToCartCount, setAddToCartCount] = useState(0);

  const shopId = '952E762C-010D-4E2B-8035-26668D99E23E';
  const deviceType = /mobile/i.test(navigator.userAgent)
    ? 'Mobile'
    : /tablet/i.test(navigator.userAgent)
    ? 'Tablet'
    : 'Desktop';

  // توليد session ID لأول مرة
  useEffect(() => {
    let storedId = localStorage.getItem('new1ssa');
    if (!storedId) {
      storedId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('new1ssa', storedId);
    }
    setSessionId(storedId);
  }, []);

  // زيادة عدد مرات الضغط على Add to Cart فقط
  const trackAddToCart = () => {
    setAddToCartCount((prev) => prev + 1);
  };

  // إرسال التراك عند تغيير الصفحة أو زيارة صفحة مهمة
  useEffect(() => {
    if (!ip || !sessionId || (addToCartCount === 0 && !isTrackablePath(pathname as any) )) return;

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
        ipAddress: ip,
        deviceType,
        checkoutPageVisited,
        completedOrder,
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

// ✅ المسارات اللي نعتبرها "قابلة للتتبع" حتى لو المستخدم ما عملش Add to Cart
function isTrackablePath(pathname: string) {
  return pathname.includes('/checkout') || pathname.includes('/thank-you');
}
