import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers.host || 'localhost:3000';

  res.setHeader('Content-Type', 'text/plain');
  res.send(`
User-agent: *
Allow: /
Disallow: /private/

Sitemap: https://${host}/sitemap.xml
  `.trim());
}
