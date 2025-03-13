import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import AuthProvider from "@/app/api/auth/[...nextauth]/auth-provider";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { ThemeProvider } from "@/app/shared/theme-provider";
import { siteConfig, metaObject } from "@/config/site.config";
import { elTajawal, inter, lexendDeca, NotoSansArabic } from "@/app/fonts";
import cn from "@utils/class-names";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
import { CartProvider } from "@/store/quick-cart/cart.context";
import { UserProvider } from "../components/context/UserContext";

import { MantineProvider } from "@mantine/core";

import { SessionContextProvider } from "@/utils/fetch/contexts";
import ShopLocalStorage from "../components/ui/ShopLocalStorage/ShopLocalStorage";
// import { shopId } from "@/config/shopId";
import { headers } from "next/headers";
import { Metadata } from "next";

const NextProgress = dynamic(() => import("@components/next-progress"), {
  ssr: false,
});

// export const metadata = {
//   title: siteConfig.title,
//   description: siteConfig.description,
// };

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

// function getServerSiteUrl() {
//   const host = headers().get("host") || "localhost:3000";
//   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
//   return `${protocol}://${host}`;
// } 
function getServerSiteUrl() {
  // const host = "theme.ordrat.com";
  const host = headers().get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
}
// function getFullServerUrl() {
//   const host = headers().get("host") || "localhost:3000";
//   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
//   const pathname = headers().get("referer") || "/";
//   return `${protocol}://${host}${new URL(pathname).pathname}`;
// }
async function fetchShopData(shopId: string, lang:string) {
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
    console.log("shopData: ",shopData);
    
    return {
      ...shopData, 
      // mainColor:  "#003049",
      // mainColorHover: "#003049",
      mainColor: shopData.mainColor || "#003049",
      mainColorHover: shopData.secondaryColor || "#003049",
      subdomainName: lang === 'ar'? shopData.nameAr : shopData.nameEn || "",
      logoUrl: shopData.logoUrl || "",
      title: lang === 'ar'? shopData.titleAr : shopData.titleEn || "",
      metaDescription: lang === 'ar'? shopData.metaDescriptionAr : shopData.metaDescriptionEn || "",
      description: lang === 'ar'? shopData.descriptionAr : shopData.descriptionEn || "",
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

async function fetchBranchZones(shopId: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/Branch/GetByShopId/${shopId}`,
      {
        headers: {
          Accept: "*/*",
          "Accept-Language": "en",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch branch zones");
    }

    const data = await res.json();
    return data.map((branch: any) => ({
      lat: branch.centerLatitude,
      lng: branch.centerLongitude,
      zoonRadius: branch.coverageRadius,
    }));
  } catch (error) {
    console.error("Error fetching branch zones:", error);
    return [];
  }
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
type LangType = 'en' | 'ar';

export const generateMetadata = async ({ params }: { params: { lang: string } }): Promise<Metadata> => {
  const realPath = getServerSiteUrl();
  const shopId = await fetchSubdomain(realPath);
  const shopData = await fetchShopData(shopId.id, params.lang);
  
  return metaObject(
    shopData.subdomainName, 
    params.lang,
    {
      title: shopData.title,
      description: shopData.metaDescription,
      url: shopData.logoUrl,
      siteName: shopData.title,
      images: [
        {
          url: shopData.logoUrl,
          width: 1200,
          height: 630,
          alt: shopData.title,
        },
      ],
      locale: params.lang === 'ar' ? 'ar_AR' : 'en_US',
      type: 'website',
    },
    shopData.metaDescription
  );
};

function hexToRgba(hex: string, opacity: number) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: any;
}) {
  const realPath = getServerSiteUrl(); // Get the real site URL
  const shopId = await fetchSubdomain(realPath);
  const session = await getServerSession(authOptions);
  const shopData = await fetchShopData(shopId.id, lang);
  const branchZones = await fetchBranchZones(shopId.id);

  return (
    <html
      lang={lang}
      dir={dir(lang)}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(elTajawal.variable ,'font-elTajawal')}
      >
        <style>
          {`
            :root {
              --main-color: ${shopData.mainColor};
              --main-color-hover: ${shopData.mainColorHover};
              --navbar-color-scroll: ${hexToRgba(shopData.mainColor, 0.75)};
              --color-20: ${hexToRgba(shopData.mainColor, 0.2)};
              --color-30: ${hexToRgba(shopData.mainColor, 0.3)};
              --color-50: ${hexToRgba(shopData.mainColor, 0.5)};
              --color-90: ${hexToRgba(shopData.mainColor, 0.9)};
            }
          `}
        </style>
        {/* Save subdomainName and logoUrl to localStorage on client-side */}

        <MantineProvider>

          <AuthProvider session={session}>
            <SessionContextProvider>
              <CartProvider>
                <ThemeProvider>
                  <UserProvider>
                    <NextProgress />
                    <ShopLocalStorage backgroud={shopData.backgroundUrl} subdomainName={shopData.subdomainName} description={shopData.description} logoUrl={shopData.logoUrl} branchZones={branchZones} shopId={shopId.id} />
                    {children}
                    <Toaster />
                    <GlobalDrawer />
                    <GlobalModal />
                  </UserProvider>
                </ThemeProvider>
              </CartProvider>
            </SessionContextProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
