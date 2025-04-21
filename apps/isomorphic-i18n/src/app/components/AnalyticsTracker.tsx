'use client';

import { useEffect } from 'react';
import os from 'os';



function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}

export default function AnalyticsTracker() {
  useEffect(() => {
    // 👇 check if sessionId already exists
    let sessionId = localStorage.getItem('ordrat_session_id');
    if (!sessionId) {
    //   sessionId = uuidv4();
      localStorage.setItem('ordrat_session_id', "j");
    }
    const ip = getLocalIP();

    // 👇 Get device type
    const deviceType = /mobile/i.test(navigator.userAgent)
      ? 'Mobile'
      : /tablet/i.test(navigator.userAgent)
      ? 'Tablet'
      : 'Desktop';

    // 👇 Make the API call
    fetch('https://testapi.ordrat.com/api/Analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        shopId: '952E762C-010D-4E2B-8035-26668D99E23E',
        ipAddress: ip,
        deviceType,
        cartPageVisited: false,
        addToCartCount: 0,
      }),
    }).catch(err => {
      console.error('Tracking failed:', err);
    });
  }, []);

  return null;
}
