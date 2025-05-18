'use client';

import { useEffect } from 'react';

export default function ShopDataValidator({ shopId }: { shopId: string | null }) {
  useEffect(() => {
    if (!shopId || shopId === 'null') {
      // ✅ منع حلقة لا نهائية
      const alreadyTried = sessionStorage.getItem('shopReloadAttempted');
      if (!alreadyTried) {
        sessionStorage.setItem('shopReloadAttempted', 'true');
        window.location.reload();
      }
    }
  }, [shopId]);

  return null;
}
