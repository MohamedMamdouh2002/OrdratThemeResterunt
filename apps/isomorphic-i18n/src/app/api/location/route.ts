// app/api/location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCountryFromIp, initGeoIp } from 'lib/geoip';

let isInitialized = false;

export async function GET(request: NextRequest) {
  // Check if database exists first
  const dbPath = path.resolve(process.cwd(), 'public/geoip-data/GeoLite2-Country.mmdb');
  const dbExists = fs.existsSync(dbPath);
  
  if (!dbExists) {
    return NextResponse.json({
      error: 'GeoIP database file not found on server',
      ip: request.headers.get('x-real-ip') || '127.0.0.1'
    });
  }
  
  // Initialize the GeoIP database
  if (!isInitialized) {
    await initGeoIp();
    isInitialized = true;
  }
  
  // Get the client's IP address
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  const ip = forwardedFor 
    ? forwardedFor.split(',')[0].trim() 
    : realIp || '127.0.0.1';
  
  // Look up the country information
  const geoData = getCountryFromIp(ip);
  
  return NextResponse.json(geoData);
}