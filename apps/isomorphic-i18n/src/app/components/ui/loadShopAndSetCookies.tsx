import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

function getServerSiteUrl() {
  // const host = "eldahan.ordrat.com";
    const host = headers().get("host") || "theme.ordrat.com";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
}

async function fetchSubdomain(subdomain: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetBySubdomain/${subdomain}`,
      {
        headers: {
          Accept: "*/*",
          "Accept-Language": "en",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch subdomain");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching subdomain:", error);
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
    if (!res.ok) throw new Error("Failed to fetch shop details");
    const shopData = await res.json();
    return {
      ...shopData,
      mainColor: shopData.mainColor || "#003049",
      mainColorHover: shopData.secondaryColor || "#003049",
      subdomainName: lang === 'ar' ? shopData.nameAr : shopData.nameEn || "",
      logoUrl: shopData.logoUrl || "",
      title: lang === 'ar' ? shopData.titleAr : shopData.titleEn || "",
      metaDescription: lang === 'ar' ? shopData.metaDescriptionAr : shopData.metaDescriptionEn || "",
      description: lang === 'ar' ? shopData.descriptionAr : shopData.descriptionEn || "",
      vat: shopData.vat || "",
      vatType: shopData.vatType,
      rate: shopData.rate,
      showAllCouponsInSideBar: shopData.showAllCouponsInSideBar,
      applyFreeShppingOnTarget: shopData.applyFreeShppingOnTarget,
      freeShppingTarget: shopData.freeShppingTarget,
      currencyId: shopData.currencyId,
    };
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return null;
  }
}

export async function loadShopAndSetCookies(lang: string) {
  const siteUrl = getServerSiteUrl();
  const shopSubdomain = await fetchSubdomain(siteUrl);
  
  if (!shopSubdomain || !shopSubdomain.id) {
    throw new Error('Shop not found for this subdomain');
  }
  
  const shopData = await fetchShopData(shopSubdomain.id, lang);
  
  const cookieStore = cookies();
  
  cookieStore.set('shopId', shopSubdomain.id, { path: '/' });
  cookieStore.set('currencyId', shopData.currencyId, { path: '/' });
  cookieStore.set('description', shopData.description, { path: '/' });
  cookieStore.set('backgroundUrl', shopData.backgroundUrl, { path: '/' });
  cookieStore.set('rate', shopData.rate, { path: '/' });
  cookieStore.set('subdomainName', shopData.subdomainName, { path: '/' });
  cookieStore.set('logoUrl', shopData.logoUrl, { path: '/' });

  return { shopId: shopSubdomain, shopData };
}
