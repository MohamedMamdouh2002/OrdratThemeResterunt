// lib/geoip.ts
import maxmind, { Reader, CountryResponse } from 'maxmind';
import path from 'path';
import fs from 'fs';
import { GeoLocationResult } from '@/types';

let geoIpLookup: Reader<CountryResponse> | null = null;

export async function initGeoIp(): Promise<Reader<CountryResponse> | null> {
  if (geoIpLookup) return geoIpLookup;

  try {
    const dbPath = path.resolve(process.cwd(), 'public/geoip-data/GeoLite2-Country.mmdb');

    // Check if the database file exists
    if (!fs.existsSync(dbPath)) {
      console.error('GeoIP database file not found. Please run "npm run update-geoip" first.');
      return null;
    }

    // Use the path directly - this works in both local and Vercel environments
    geoIpLookup = await maxmind.open<CountryResponse>(dbPath);
    console.log('GeoIP database loaded successfully');
    return geoIpLookup;
  } catch (error) {
    console.error('Error loading GeoIP database:', error);
    return null;
  }
}

export function getCountryFromIp(ip: string): GeoLocationResult {
  if (!geoIpLookup) {
    return { error: 'GeoIP database not initialized', ip };
  }

  try {
    // For local development, use a fallback IP
    if (ip === '::1' || ip === '127.0.0.1') {
      return {
        country: {
          iso_code: 'US',
          names: { en: 'United States' }
        },
        ip,
        note: 'Using fallback for local IP'
      };
    }

    const result = geoIpLookup.get(ip);

    if (!result) {
      return { error: 'Location not found', ip };
    }

    // Extract just the country data we need
    return {
      ip,
      country: result.country ? {
        iso_code: result.country.iso_code,
        // Use type assertion to satisfy TypeScript
        names: result.country.names as unknown as { [key: string]: string }
      } : undefined
    };
  } catch (error) {
    const err = error as Error;
    console.error('Error looking up IP:', err);
    return { error: err.message, ip };
  }
}