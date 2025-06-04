import { headers } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

async function fetchSubdomain(subdomain: string, lang: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetBySubdomain/${subdomain}`,
      {
        headers: {
          Accept: "/",
          "Accept-Language": lang,
        },
        cache: "no-store"
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
        next: { revalidate: 5 },
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
      currencyAbbreviation: shopData.currencyAbbreviation || null,
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
function getServerSiteUrl() {
  // const host = "theme.ordrat.com";
  const host = headers().get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
}

export default async function ServerHeaderData(lang: string = "en") {
  const realPath = getServerSiteUrl();
  const subdomainData = await fetchSubdomain(realPath, lang);

  const isFallback = !subdomainData || !subdomainData.id;

  if (isFallback) {
    return {
      logoUrl: "",
      shopName: "",
      backgroundUrl: "",
      rate: 1,
      shopId: "",
      description: "",
      currencyId: "",
      currencyAbbreviation: " ",
      isFallback: true, // ✅ أضف flag
    };
  }

  const shopData = await fetchShopData(subdomainData.id, lang);

  return {
    logoUrl: shopData.logoUrl || "",
    shopName: shopData.subdomainName || "",
    backgroundUrl: shopData.backgroundUrl || "",
    rate: shopData.rate ?? 1,
    shopId: shopData.shopId || "",
    description: shopData.description || "",
    currencyId: shopData.currencyId || "",
    currencyAbbreviation: shopData.currencyAbbreviation || "",
    isFallback: false,
  };
}

