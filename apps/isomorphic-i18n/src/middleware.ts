import { pagesOptions } from "@/app/api/auth/[...nextauth]/pages-options";
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export default withAuth({
  pages: {
    ...pagesOptions,
  },
});

export const config = {
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
const shopCookieName = "shopId"; // اسم كوكي الشوب

export async function middleware(req: any) {
  const response = NextResponse.next();

  // ===================== (1) Language Redirection =====================
  if (req.nextUrl.pathname.indexOf("chrome") > -1) {
    return response;
  }

  let lang;
  if (req.cookies.has(cookieName)) {
    lang = acceptLanguage.get(req.cookies.get(cookieName).value);
  }
  if (!lang) {
    lang = acceptLanguage.get(req.headers.get("Accept-Language"));
  }
  if (!lang) {
    lang = fallbackLng;
  }

  if (
    !languages.some((local) => req.nextUrl.pathname.startsWith(`/${local}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer);
    }
  }

  // ===================== (2) Shop Data Handling =====================

  // لو مفيش shopId في الكوكي
  if (!req.cookies.has(shopCookieName)) {
    try {
      const host = req.headers.get('host')?.replace('www.', '') || '';

      // جيب الشوب من API
      const shopRes = await fetch(`https://testapi.ordrat.com/api/Shop/GetBySubdomain/${host}`, {
        headers: {
          Accept: "*/*",
        },
      });

      if (shopRes.ok) {
        const shopData = await shopRes.json();

        // احط الكوكيز بالمعلومات
        response.cookies.set('shopId', shopData.id, { path: '/' });
        response.cookies.set('subdomainName', shopData.nameEn || "", { path: '/' });
        response.cookies.set('logoUrl', shopData.logoUrl || "", { path: '/' });
        response.cookies.set('currencyId', shopData.currencyId || "", { path: '/' });
        response.cookies.set('vat', String(shopData.vat || 0), { path: '/' });
        response.cookies.set('vatType', String(shopData.vatType || 0), { path: '/' });
        response.cookies.set('rate', String(shopData.rate || 0), { path: '/' });
        response.cookies.set('description', shopData.descriptionEn || "", { path: '/' });
        response.cookies.set('showAllCouponsInSideBar', JSON.stringify(shopData.showAllCouponsInSideBar || false), { path: '/' });
        response.cookies.set('applyFreeShppingOnTarget', JSON.stringify(shopData.applyFreeShppingOnTarget || false), { path: '/' });
        response.cookies.set('freeShppingTarget', String(shopData.freeShppingTarget || 0), { path: '/' });

        // لو حابب كمان تحط branchZones في الكوكيز تقدر تكمل هنا
      }
    } catch (error) {
      console.error("Error fetching shop data in middleware:", error);
    }
  }

  return response;
}
