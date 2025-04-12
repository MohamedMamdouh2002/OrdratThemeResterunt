import { API_BASE_URL } from "@/config/base-url";
import { NextApiRequest, NextApiResponse } from "next";

function getServerSiteUrl(host: string) {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

async function fetchSubdomain(host: string) {
  try {
    const res = await fetch(`https://testapi.ordrat.com/api/Shop/GetBySubdomain/${host}`, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch shop info");

    const data = await res.json();
    console.log("✅ Shop fetched:", data.id); // debug log
    return data.id;
  } catch (error) {
    console.error("❌ Error fetching shop info:", error);
    return null;
  }
}

async function GetHome({ lang, shopId }: { lang: string; shopId: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Category/GetAll/${shopId}`, {
      method: "GET",
      headers: {
        "Accept-Language": lang,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch categories");

    const data: AllCategories[] = await response.json();
    console.log(`✅ Categories (${lang}):`, data.length); // debug log
    return data;
  } catch (error) {
    console.error(`❌ Error fetching categories (${lang}):`, error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers.host || "theme.ordrat.com";
  const siteUrl = getServerSiteUrl(host);

  const shopId = await fetchSubdomain(host);
  if (!shopId) {
    res.status(500).send("❌ Failed to determine shop ID");
    return;
  }

  const categoriesEn = await GetHome({ lang: "en", shopId });
  const categoriesAr = await GetHome({ lang: "ar", shopId });

  try {
    const pages = ["", "cart", "checkout", "faq", "orders", "privacy-policy", "profile", "refund-Policy", "search"];

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

    const categoryPages = [
      ...(categoriesAr?.map(
        (cat:any) =>
          `<url>
            <loc>${siteUrl}/ar/product/${cat.id}</loc>
            <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
          </url>`
      ) || []),
      ...(categoriesEn?.map(
        (cat:any) =>
          `<url>
            <loc>${siteUrl}/en/product/${cat.id}</loc>
            <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
          </url>`
      ) || []),
    ].join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${staticPages}
  ${categoryPages}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    res.status(500).send("Internal Server Error");
  }
}
