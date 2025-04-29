// app/api/ip/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] ?? '0.0.0.0';
  return NextResponse.json({ ip });
}
