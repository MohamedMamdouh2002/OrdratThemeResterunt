import { pagesOptions } from "@/app/api/auth/[...nextauth]/pages-options";
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "./app/i18n/settings";
import { headers } from "next/headers";

acceptLanguage.languages(languages);

export default withAuth({
  pages: {
    ...pagesOptions,
    
  },
});

export const config = {
  // restricted routes
  matcher: [
    "/",
    "/analytics",
    "/logistics/:path*",
    "/ecommerce/:path*",
    "/support/:path*",
    "/file/:path*",
    "/file-manager",
    "/invoice/:path*",
    "/forms/profile-settings/:path*",
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};

const cookieName = "i18next";

export async function middleware(req: any) {
  if (
    // req.nextUrl.pathname.indexOf('icon') > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  )
    return NextResponse.next();
  let lang;
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
      return [];
    }
  }
async function fetchShopData(shopId: string, lang: string) {
  const siteUrl = getServerSiteUrl();
  // const fullSiteUrl = getFullServerUrl();
  // console.log("Fetching full SiteUrl from:", fullSiteUrl);

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
    // console.log("shopData: ", shopData);

    return {
      ...shopData,
      // mainColor:  "#003049",
      // mainColorHover: "#003049",
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
    return {
      mainColor: "#f97316",
      mainColorHover: "#c96722",
      subdomainName: "",
      logoUrl: "",
    };
  }
}
  function getServerSiteUrl() {
    // const host = "eldahan.ordrat.com";
    const host = headers().get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${host}`;
  }

  const realPath = getServerSiteUrl();

  const shopId = await fetchSubdomain(realPath);
  const shopData = await fetchShopData(shopId.id, lang as any);
  const response = NextResponse.next();
  response.cookies.set("shopId", shopId, {path: "/"});
  response.cookies.set("currencyId", shopData.currencyId, {path: "/"});
  response.cookies.set("description", shopData.description, {path: "/"});
  response.cookies.set("backgroundUrl", shopData.backgroundUrl, {path: "/"});
  response.cookies.set("rate", shopData.rate, {path: "/"});
  response.cookies.set("subdomainName", shopData.subdomainName, {path: "/"});
  response.cookies.set("logoUrl", shopData.languages, {path: "/"});
   response.cookies.set("languages", shopData.languages, {
    path: "/",
    secure: true,

  });
  if (req.cookies.has(cookieName)) lang = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lang) lang = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lang) lang = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((local) => req.nextUrl.pathname.startsWith(`/${local}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }
 const languageOption = req.cookies.get('languageOption')?.value;

  const pathname = req.nextUrl.pathname;

  // ✅ لو المستخدم دخل على `/` مباشرة
  if (pathname === '/') {
    if (languageOption === '1') {
      return NextResponse.redirect(new URL('/en', req.url));
    } else {
      return NextResponse.redirect(new URL('/ar', req.url));
    }
  }
  return NextResponse.next();
}