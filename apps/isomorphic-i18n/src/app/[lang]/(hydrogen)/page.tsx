import Footer from "@/app/components/footer/Footer";
import Grills from "@/app/components/grills/Grills";
import HeaderData from "@/app/components/header/HeaderData";
import HomeSchema from "@/app/components/HomeSchema";
import MainSlider from "@/app/components/mainSlider/MainSlider";
import NavMobile from "@/app/components/navMobile/NavMobile";
import RestaurantTitle from "@/app/components/restaurantTitle/RestaurantTitle";
import ServerHeaderData from "@/app/components/ServerHeader";
import { getServerShopId } from "@/app/components/ui/getServerShopId";
import AutoRefreshOnFallback from "@/app/components/ui/Refresh";
import ScrollToTop from "@/app/components/ui/ScrollToTop";
import { API_BASE_URL } from "@/config/base-url";
import { GetBannerData, getBranches, getCoupons, GetHomeData } from "@/server/home";
import { cookies } from "next/headers";

export default async function FileDashboardPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const banner = await GetBannerData(lang);
  const page = 1;
  const pageSize = 30;
  const ProductData = await GetHomeData(lang, page, pageSize);
  const headerData = await ServerHeaderData(lang);
  if (!headerData.shopId) {
  console.warn("shopId not found, fallback layout will be used");
}

  const coupons = await getCoupons();
  
  const branches = await getBranches(lang);

  return (
    <>
      <div className="relative">
        <ScrollToTop />
        <HomeSchema
          lang={lang!}
          logoUrl={headerData.logoUrl}
          shopName={headerData.shopName}
          description={headerData.description}
        />
        <RestaurantTitle currencyName={headerData.currencyAbbreviation} lang={lang} logoUrl={headerData.logoUrl} shopId={headerData.shopId}
          shopName={headerData.shopName}
          background={headerData.backgroundUrl}  description={headerData.description}
          coupon={coupons} branch={branches} />
        <NavMobile lang={lang!} HomeData={ProductData} />
        <HeaderData  lang={lang} logoUrl={headerData.logoUrl} shopId={headerData.shopId} description={headerData.description}
          shopName={headerData.shopName}
          backgroundUrl={headerData.backgroundUrl} />
        <MainSlider banner={banner} />
        <Grills lang={lang} HomeData={ProductData} shopIdserver={headerData.shopId as string} currencyName={headerData.currencyAbbreviation} initialPage={page} pageSize={pageSize} />
        <Footer lang={lang} shopIdserver={headerData.shopId as string} />
      </div>
    </>
  );
}