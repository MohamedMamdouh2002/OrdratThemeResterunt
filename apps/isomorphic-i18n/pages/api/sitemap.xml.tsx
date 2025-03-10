import { NextApiRequest, NextApiResponse } from "next";

const siteUrl = "https://theme.ordrat.com";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pages = ["", "cart", "checkout", "faq", "orders", "privacy-policy", "profile", "refund-Policy", "search"];

    if (!pages || pages.length === 0) {
      throw new Error("No pages found!");
    }

    const staticPages = pages
      .map(
        (page) => `
      <url>
        <loc>${siteUrl}/ar/${page}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      </url>
      <url>
        <loc>${siteUrl}/en/${page}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      </url>`
      )
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${staticPages}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Internal Server Error");
  }
}
