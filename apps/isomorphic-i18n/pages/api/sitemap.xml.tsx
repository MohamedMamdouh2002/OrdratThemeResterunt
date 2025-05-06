import { API_BASE_URL } from "@/config/base-url";
import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/headers";



async function fetchSubdomain(subdomain: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetBySubdomain/${subdomain}`,
      {
        headers: {
          Accept: "/",
          "Accept-Language": "en",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch branch zones");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching branch zones:", error);
    return null;
  }
}

async function fetchShopData(shopId: string, lang: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetById/${shopId}`,
      {
        headers: {
          Accept: "*/*",
          "Accept-Language": lang,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch shop details");
    }

    const shopData = await res.json();

    return {
      logoUrl: shopData.logoUrl || "",
      subdomainName: lang === 'ar' ? shopData.nameAr : shopData.nameEn || "",
      rate: shopData.rate || null,
      backgroundUrl: shopData.backgroundUrl || "",
      description: lang === 'ar' ? shopData.descriptionAr : shopData.descriptionEn || "",
      shopId: shopData.id || null,
      currencyId: shopData.currencyId || null,
    };
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return {
      logoUrl: "",
      subdomainName: "",
      rate: null,
      backgroundUrl: "",
      description: "",
      shopId: null,
      currencyId: null,
    };
  }
}

function getServerSiteUrl(req: NextApiRequest) {
  const host = req.headers.host || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
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
  const realPath = getServerSiteUrl(req);
  const subdomainData = await fetchSubdomain(realPath);
  console.log("✅ subdomainData:", subdomainData);
  if (!subdomainData || !subdomainData.id) {
    console.error("❗ subdomainData is invalid:", subdomainData);
    return res.status(500).send("Invalid subdomain data");
  }
  
  const categoriesEn = await GetHome({ lang: "en", shopId: subdomainData.id });
  console.log("✅ categoriesEn:", categoriesEn);
  
  const categoriesAr = await GetHome({ lang: "ar", shopId: subdomainData.id });
  console.log("✅ categoriesAr:", categoriesAr);

  try {
    const pages = ["", "cart", "checkout", "faq", "orders", "privacy-policy", "profile", "refund-Policy", "search"];

    const staticPages = pages
      .map(
        (page) => `
      <url>
        <loc>https://${realPath}/ar/${page}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      </url>
      <url>
        <loc>https://${realPath}/en/${page}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      </url>`
      )
      .join("\n");

    const categoryPages = [
      ...(categoriesAr?.map(
        (cat: any) =>
          `<url>
            <loc>https://${realPath}/ar/product/${cat.id}</loc>
            <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
          </url>`
      ) || []),
      ...(categoriesEn?.map(
        (cat: any) =>
          `<url>
            <loc>https://${realPath}/en/product/${cat.id}</loc>
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