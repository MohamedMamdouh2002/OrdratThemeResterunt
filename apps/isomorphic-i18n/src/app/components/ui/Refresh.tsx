'use client';

import { useEffect } from 'react';

export default function AutoRefreshOnFallback({ isFallback }: { isFallback: boolean }) {
  useEffect(() => {
    const alreadyReloaded = sessionStorage.getItem('shopReloaded');

    if (isFallback) {
      if (!alreadyReloaded) {
        sessionStorage.setItem('shopReloaded', 'true');
        window.location.reload();
      }
    } else {
      // ✅ بعد ما الداتا بقت سليمة، امسح العلم
      if (alreadyReloaded) {
        sessionStorage.removeItem('shopReloaded');
      }
    }
  }, [isFallback]);

  return null;
}
