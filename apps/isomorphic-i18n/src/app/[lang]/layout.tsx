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
import logo from '@public/assets/orderLogo.svg'

import { MantineProvider } from "@mantine/core";

import { SessionContextProvider } from "@/utils/fetch/contexts";
import ShopLocalStorage from "../components/ui/ShopLocalStorage/ShopLocalStorage";
// import { shopId } from "@/config/shopId";
import { headers } from "next/headers";
import { Metadata } from "next";
import AutoModal from "../components/modalAds/ModalAds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faSquareFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
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
  const host = "theme.ordrat.com";
  // const host = headers().get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${host}`;
}
// function getFullServerUrl() {
//   const host = headers().get("host") || "localhost:3000";
//   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
//   const pathname = headers().get("referer") || "/";
//   return `${protocol}://${host}${new URL(pathname).pathname}`;
// }
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
    console.log("shopData: ", shopData);

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
      vat:  shopData.vat || "",
      vatType:  shopData.vatType ,
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
export async function fetchSellerPlanStatus(sellerId: string) {
  try {
    const res = await fetch(
      `https://testapi.ordrat.com/api/SellerPlanSubscription/GetSellerPlanActiveSubscription/${sellerId}`,
      {
        headers: {
          Accept: '*/*',
          "Accept-Language": "en",
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch seller plan status");
    }

    const data = await res.json();

    const isFreeTrial = Array.isArray(data) && data.some(plan => plan.freeTrial === true);
    const isActive = Array.isArray(data) && data.some(plan => plan.subscriptionStatus !== 0);

    return { isFreeTrial, isActive };
  } catch (error) {
    console.error("Error fetching seller plan status:", error);
    return { isFreeTrial: false, isActive: false };
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
  let shopId = null;
  let shopData = null;
  let branchZones = [];
  let showTrialModal = false;
  const session = await getServerSession(authOptions);

  try {
    shopId = await fetchSubdomain(realPath);

    // Check if shopId or shopId.id is invalid
    if (!shopId || !shopId.id) throw new Error("Invalid subdomain");

    shopData = await fetchShopData(shopId.id, lang);
    const { isFreeTrial, isActive } = await fetchSellerPlanStatus(shopId.id);

    if (isFreeTrial) {
      showTrialModal = true;
    }
    // Check if the shop is not active
    if (!isActive) {
      return (

        <div className="min-h-screen w-screen flex items-center justify-center bg-[#E3E3E5] text-center">
          <div className="p-6 w-screen ">
        <div className="w-44 mb-3 mx-auto">
          <a href='https://ordrat.com' target='_blank' className="">

              <Image width={100} height={70} src={logo} className='w-full h-full' alt='اوردرات - أفضل منصة إنشاء متجر إلكتروني ومنيو باركود احترافي'/>
          </a>
          </div>    
            <h1 className="md:text-4xl text-2xl font-bold text-red-500 mb-4">المتجر غير مفعل</h1>
            <p className="text-mainColorHover md:text-2xl text-lg font-medium mb-2">
              نعتذر عن عدم الوصول لعدم تجديد الاشتراك من قبل المالك
            </p>
            <p className="text-mainColorHover bg-white  md:px-40 px-5 w-fit my-2 mx-auto rounded-lg  md:py-5 py-4 text-2xl font-medium mb-2">
              {" "}   {realPath || ''} {" "}

            </p>
            <p className="text-mainColorHover md:text-2xl text-lg font-medium mb-4">
              اذا كنت المالك وحدثت المشكلة يمكنك الدخول لحسابك من هنا
              وتجديد الاشتراك
            </p>
            <button
              className="bg-[#E84654] font-bold w-fit px-5 my-2 mx-auto py-3 text-white rounded-lg"
            >
              تجديد الاشتراك
            </button>

            <p className="text-mainColorHover md:text-xl text-base font-medium my-2">
              او قم بالتواصل مع الدعم الفنى عبر احد القنوات
            </p>

            <div className="flex justify-center items-center gap-5 mt-4 mx-2">
              <a
                href="https://wa.me/201055516150"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className='md:text-xl text-2xl md:w-10 w-8 text-green-500' />
              </a>

              <a href="https://www.facebook.com/ordratofficial/">

                <FontAwesomeIcon icon={faSquareFacebook} className='md:text-xl text-2xl md:w-10 w-8 text-blue-500' />
              </a>
            </div>
          </div>
        </div>
      );
    }

    branchZones = await fetchBranchZones(shopId.id);

    // Optional extra check
    if (!shopData || !shopData.subdomainName) throw new Error("Invalid shop data");

  } catch (error) {
    console.error("Error loading shop layout:", error);
    return <>
      <div className="min-h-screen w-screen flex items-center justify-center bg-[#E3E3E5] text-center">
        <div className="p-6 w-screen ">
        <div className="w-44 mb-3 mx-auto">
          <a href='https://ordrat.com' target='_blank' className="">

              <Image width={100} height={70} src={logo} className='w-full h-full' alt='اوردرات - أفضل منصة إنشاء متجر إلكتروني ومنيو باركود احترافي'/>
          </a>
          </div> 
          <h1 className="md:text-4xl text-2xl font-bold text-red-500 mb-4">تهانينا</h1>
          <p className="text-mainColorHover md:text-2xl text-lg font-medium mb-4">
            الرابط متاح يمكنك انشاء متجرك
          </p>
          <p className="text-mainColorHover bg-white md:px-40 px-5 w-fit my-2 mx-auto rounded-lg  md:py-5 py-3 md:text-2xl text-lg font-medium mb-2">
            {" "}   {realPath || ''} {" "}

          </p>

          <p className="text-mainColorHover  md:text-xl text-lg font-medium my-2">
            قم بزيارة أوردرات لانشاء متجرك الان مجانا
          </p>
          <a href="https://ordrat.com/ar/%D8%A7%D9%84%D8%AA%D8%B3%D8%B9%D9%8A%D8%B1" target='_blank'>

            <button
              className="bg-[#E84654] font-bold w-fit px-5 my-2 mx-auto py-3 text-white rounded-lg"
            >
              أنشئ متجرك الإلكتروني الآن


            </button>

          </a>
        </div>
      </div >
    </>



  }


  return (
    <html
      lang={lang}
      dir={dir(lang)}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={shopData.logoUrl} type="image/x-icon" />
      </head>
      <body suppressHydrationWarning className={cn(elTajawal.variable, 'font-elTajawal')}>
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

        <MantineProvider>
          <AuthProvider session={session}>
            <SessionContextProvider>
              <CartProvider>
                <ThemeProvider>
                  <UserProvider>
                    <NextProgress />
                    {showTrialModal && <AutoModal />} 
                    {/* <AutoModal /> */}
                    <ShopLocalStorage
                      vat={shopData.vat}
                      vatType={shopData.vatType}
                      backgroud={shopData.backgroundUrl}
                      subdomainName={shopData.subdomainName}
                      description={shopData.description}
                      logoUrl={shopData.logoUrl}
                      branchZones={branchZones}
                      shopId={shopId.id}
                    />
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

