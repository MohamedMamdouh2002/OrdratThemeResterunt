import Footer from "@/app/components/footer/Footer";
import Grills from "@/app/components/grills/Grills";
import Header from "@/app/components/header/Header";
import MainSlider from "@/app/components/mainSlider/MainSlider";
import RestaurantTitle from "@/app/components/restaurantTitle/RestaurantTitle";
import ServerHeaderData from "@/app/components/ServerHeader";
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
  const headerData = ServerHeaderData();


  const coupons = await getCoupons();
  const branches = await getBranches(lang);
  return (
    <>
      <ScrollToTop />
      {/* <RestaurantTitle lang={lang} logoUrl={headerData.logoUrl} shopId={headerData.shopId}
        shopName={headerData.shopName}
        background={headerData.backgroundUrl} rate={headerData.rate} description={headerData.description}
         coupon={coupons} branch={branches} /> */}
      <Header lang={lang} logoUrl={headerData.logoUrl}  shopId={headerData.shopId} description={headerData.description}
        shopName={headerData.shopName}
        background={headerData.backgroundUrl}/>
      <MainSlider banner={banner} />
      <Grills lang={lang} HomeData={ProductData}  shopId={headerData.shopId as string} initialPage={page} pageSize={pageSize} />
      <Footer lang={lang} />
    </>
  );
}