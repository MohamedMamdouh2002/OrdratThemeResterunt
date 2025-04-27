
'use client'// Header.tsx
import Image from 'next/image'
import React, { useEffect } from 'react'
import logPhoto from '@public/assets/landing.webp'
import Link from 'next/link'
import CustomImage from '../ui/CustomImage'
import { useTranslation } from '@/app/i18n/client'

function Header({ lang, logoUrl, shopName, background,shopId, description }: {
  lang?: string
  logoUrl: string | null;
  shopName: string | null;
  description: string | null;
  background: string | null;
  shopId: string | null;
}) {
  // const [shopName, setShopName] = useState<string | null>(null);
  // const [shopLogo, setShopLogo] = useState<any | null>('');
  // const [description, setDescription] = useState<string | null>(null);
  // const [background, setBackground] = useState<string | null>(null);
  const { t, i18n } = useTranslation(lang!, 'home');

  useEffect(() => {
    i18n.changeLanguage(lang);
   
  }, [lang, i18n]);


  return (
    <>
      <div
        style={{
          backgroundImage: background ? `url(${background})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          height: "450px",
          zIndex: 2,
          position: "relative", // مهم جداً علشان overlay يبقى داخل نفس الـ div
        }}
        className="imgBg h-[450px] hidden lg:flex"
      >
        {/* ✅ لير سوده شفافه */}
        <div className="absolute inset-0 bg-[#5c5c5c] bg-opacity-50 z-[1]" />
        <div className=" w-[90%] mx-auto pt-10 z-20 relative flex flex-col justify-center items-center">

          <div className="w-[160px] h-[160px] mx-auto">
          {logoUrl && (
            <CustomImage
              src={logoUrl as any}
              width={900}
              height={500}
              className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
              alt="logPhoto"
            />
            )}
          </div>
          <h1 className="text-2xl text-white lg:text-3xl xl:text-5xl font-bold">
            {lang==='ar' ?'اهلا بكم':'Welcome to'}{" "} {shopName&&shopName}
          </h1>
          <p className="text-sm text-white lg:text-lg xl:text-xl font-normal my-4 ">
            {description&&description}
          </p>
          <Link href={`/${lang}/search`}>
            <button className="w-32 h-10 bg-mainColor hover:bg-mainColorHover rounded-md text-white">
              {lang==='ar'?'عرض الكل':'View All'}
            </button>
          </Link>
        </div>
        {/* <div className="absolute bottom-0 end-0 xl:end-12 p-5 w-[250px] xl:w-[400px] h-96 "> */}


        {/* </div> */}
      </div>
    </>
  );
}

export default Header;
