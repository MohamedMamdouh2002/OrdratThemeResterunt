// Header.tsx
'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import logPhoto from '@public/assets/landing.webp'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n/client';

function Header({ lang }: { lang?: string }) {
  const { t, i18n } = useTranslation(lang!, 'home');
  const [shopName, setShopName] = useState<string | null>(null);
  const [shopLogo, setShopLogo] = useState<any | null>('');
  const [description, setDescription] = useState<string | null>(null);
  useEffect(() => {
    i18n.changeLanguage(lang);
    const storedName = localStorage.getItem("subdomainName");
    const Logo = localStorage.getItem("logoUrl");
    const description = localStorage.getItem("description");
    if (storedName) {
      setShopName(storedName);
      setDescription(description)
      setShopLogo(Logo)
    }
  }, [lang, i18n]);


  return (
    <>
      <div className="bg-Color30 h-[400px] hidden lg:flex">
        <div className="w-[90%] mx-auto pt-10 relative flex justify-between items-center">
          <div className='w-[50%]'>
            <h1 className="text-2xl lg:text-3xl xl:text-5xl font-bold">
              {t('Welcome-to')}<br /> {shopName}
            </h1>
            <p className="text-sm lg:text-lg xl:text-xl font-normal my-3 ">
              {description}
            </p>
            <Link href={`/${lang}/search`}>
              <button className="w-32 h-10 bg-mainColor rounded-md text-white">
                {t('View-Product')}
              </button>
            </Link>
          </div>
          <div className="absolute bottom-0 end-0 xl:end-12 p-5 w-[250px] xl:w-[400px] h-96 ">
          <Image
  src={shopLogo as any}
  width={900}
  height={500}
  className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
  alt="logPhoto"
/>


          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
