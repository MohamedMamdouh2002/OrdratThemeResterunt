'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import CustomImage from '../ui/CustomImage'
import { useTranslation } from '@/app/i18n/client'

function HeaderData({ lang, logoUrl, shopName, backgroundUrl, shopId, description }: {
  lang?: string
  logoUrl: string;
  shopName: string;
  description: string;
  backgroundUrl: string;
  shopId: string;
}) {
  const [shopData, setShopData] = useState({
    logoUrl: logoUrl || '',
    shopName: shopName || '',
    description: description || '',
    backgroundUrl: backgroundUrl || ''
  });

  const { t, i18n } = useTranslation(lang!, 'home');

  useEffect(() => {
    i18n.changeLanguage(lang);

    // فقط لو البيانات ناقصة
    if (!logoUrl || !shopName || !description || !backgroundUrl) {
      const storedLogo = localStorage.getItem("logoUrl");
      const storedName = localStorage.getItem("subdomainName");
      const storedBackground = localStorage.getItem("backgroundUrl");
      const storedDescription = localStorage.getItem("description");

      setShopData({
        logoUrl: storedLogo || logoUrl || '',
        shopName: storedName || shopName || '',
        description: storedDescription || description || '',
        backgroundUrl: storedBackground || backgroundUrl || ''
      });
    }
  }, [lang, i18n, logoUrl, shopName, backgroundUrl, description]);

  return (
    <div
      style={{
        backgroundImage: shopData.backgroundUrl ? `url(${shopData.backgroundUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        height: "450px",
        zIndex: 2,
        position: "relative",
      }}
      className="imgBg h-[450px] hidden lg:flex"
    >
      <div className="absolute inset-0 bg-[#5c5c5c] bg-opacity-50 z-[1]" />
      <div className="w-[90%] mx-auto pt-10 z-20 relative flex flex-col justify-center items-center">
        <div className="w-[160px] h-[160px] mx-auto">
          {shopData.logoUrl && (
            <CustomImage
              src={shopData.logoUrl}
              width={900}
              height={500}
              className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
              alt="logPhoto"
            />
          )}
        </div>
        <h1 className="text-2xl text-white lg:text-3xl xl:text-5xl font-bold">
          {lang === 'ar' ? 'اهلا بكم في' : 'Welcome to'} {shopData.shopName}
        </h1>
        <p className="text-sm text-white lg:text-lg xl:text-xl font-normal my-4">
          {shopData.description}
        </p>
        <Link href={`/${lang}/search`}>
          <button className="w-32 h-10 bg-mainColor hover:bg-mainColorHover rounded-md text-white">
            {lang === 'ar' ? 'عرض الكل' : 'View All'}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HeaderData;
