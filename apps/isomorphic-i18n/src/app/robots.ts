import type { MetadataRoute } from 'next'
import { headers } from 'next/headers';

const siteUrl = process.env.NODE_ENV === "production" ? "https" : "http";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    // sitemap: `http://localhost:3001/sitemap.xml`,
  }
}