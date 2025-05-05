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
        cache: "no-store",

      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch branch zones599");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching branch zones:كمتنكنكم", error);
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
    return shopData;
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return null;
  }
}

function getServerSiteUrl() {
  // const host = "theme.ordrat.com";
  const host = headers().get("host") || "localhost:3001";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
}

// ✨ Get ShopId directly
export async function getServerShopId(lang: string = "en") {
  const realPath = getServerSiteUrl();
  const subdomainData = await fetchSubdomain(realPath);
  if (!subdomainData || !subdomainData.id) {
    console.error("No subdomain id found");
    return null;
  }
  const shopData = await fetchShopData(subdomainData.id, lang);
  return shopData?.id || null;
}
