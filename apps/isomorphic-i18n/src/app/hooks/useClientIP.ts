'use client';
import { useEffect, useState } from 'react';

export default function useClientIP() {
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch('/api/ip');
        const data = await res.json();
        setIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };

    fetchIp();
  }, []);

  return ip;
}
