"use client";

import Link from "next/link";
import { Badge, ActionIcon, Input } from "rizzui";
import cn from "@utils/class-names";
import MessagesDropdown from "@/layouts/messages-dropdown";
import NotificationDropdown from "@/layouts/notification-dropdown";
import ProfileMenu from "@/layouts/profile-menu";
import SettingsButton from "@/layouts/settings-button";
import HamburgerButton from "@/layouts/hamburger-button";
import Logo from "@components/logo";
import photo from '@public/assets/banner.jpg'
import {
  PiBellSimpleRingingDuotone,
  PiChatsCircleDuotone,
  PiGearDuotone,
  // IoSearchOutline ,
  PiMagnifyingGlassDuotone,
} from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import HeaderMenuLeft from "@/layouts/lithium/lithium-menu";
import Sidebar from "@/layouts/hydrogen/sidebar";
import StickyHeader from "@/layouts/sticky-header";
import LanguageSwitcher from "@/app/i18n/language-switcher";
import SearchWidget from "@/app/shared/search/search";
import Navbar from "@/app/components/navbar/Navbar";
import Image from "next/image";
import logo from '@public/assets/karam-el-sham.png'
import { AlignCenter, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SideNav } from "@/app/components/sideNav/SideNav";
import path from "path";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import CustomImage from "@/app/components/ui/CustomImage";
import { cookies } from "next/headers";

function HeaderMenuRight() {
  return (
    <div className="ms-auto flex shrink-0 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      {/* <MessagesDropdown>
        <ActionIcon
          aria-label="Messages"
          variant="text"
          className={cn(
            " relative h-[34px] w-[34px] overflow-hidden rounded-full md:h-9 md:w-9 3xl:h-10 3xl:w-10 "
          )}
        >
          <PiChatsCircleDuotone className="h-6 w-auto" />
          <Badge
            renderAsDot
            color="success"
            enableOutlineRing
            className="absolute right-1 top-2.5 -translate-x-1 -translate-y-1/4"
          />
        </ActionIcon>
      </MessagesDropdown>
      <NotificationDropdown>
        <ActionIcon
          aria-label="Notification"
          variant="text"
          className={cn(
            "relative h-[34px] w-[34px] overflow-hidden rounded-full md:h-9 md:w-9 3xl:h-10 3xl:w-10"
          )}
        >
          <PiBellSimpleRingingDuotone className="h-6 w-auto" />
          <Badge
            renderAsDot
            color="warning"
            enableOutlineRing
            className="absolute right-1 top-2.5 -translate-x-1 -translate-y-1/4"
          />
        </ActionIcon>
      </NotificationDropdown>
      <SettingsButton className="rounded-full text-gray-700 shadow-none backdrop-blur-none hover:text-gray-1000 3xl:h-10 3xl:w-10 dark:bg-gray-100/0">
        <PiGearDuotone className="h-[22px] w-auto animate-spin-slow" />
      </SettingsButton>
      <ProfileMenu
        buttonClassName="w-auto sm:w-auto p-1 border border-gray-300"
        avatarClassName="!w-7 !h-7 sm:!h-8 sm:!w-8"
      /> */}
    </div>
  );
}

export default function Header({
  lang,
  logoUrl,
  shopName,
  background,
}: {
  lang: string;
  logoUrl: string | null;
  shopName: string | null;
  background: string | null;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [isStickyVisible, setStickyVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation(lang!, 'nav');
  // const [logoUrl, setLogoUrl] = useState<string | null>(null);
  // const [shopName, setShopName] = useState<string | null>(null);
  // const [background, setBackground] = useState<string | null>(null);

 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 0) {
        setStickyVisible(true);
      } else {
        setStickyVisible(false);
      }

      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);


  return <>
    <Navbar lang={lang} className={`   ${isStickyVisible ? "hidden  " : " "}`} />

    <StickyHeader

      className={`hidden lg:flex  w-full z-40  ${isStickyVisible ? "bg-navbarColorScroll  backdrop-blur-lg *:text-white" : "bg-white border-b-2"

        }`}
    >
      <div className=" w-[91%] mx-auto z-[40] flex  justify-between 2xl:py-1 3xl:px-8">
        <div className="hidden lg:grid w-full grid-cols-[220px_1fr_220px] items-center">
          <div className="flex items-center gap-4 justify-start">
            <Link
              aria-label="Site Logo"
              href={`/${lang}/`}
              className="flex items-center gap-4"
            >
              {logoUrl ? (
                <CustomImage src={logoUrl} width={60} height={60} alt="logo" className="max-w-[60px]" />
              ) : (
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
              )}
              <h2 className={`font-bold text-lg ${isStickyVisible ? `text-white` : `text-black`}`}>{shopName}</h2>
            </Link>
          </div>
          <div className="flex justify-center xl:ms-52">
            <HeaderMenuLeft lang={lang} />
          </div>
        </div>
        <div className="flex w-full items-center gap-5 lg:w-auto 3xl:gap-6">
          <div className="flex w-full max-w-2xl items-center lg:w-auto gap-4">
            <HamburgerButton
              view={<Sidebar className="static w-full 2xl:w-full" lang={lang} />}
            />
            <Link
              aria-label="Site Logo"
              href={`/${lang}/`}
              className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 lg:hidden"
            >
              <Logo iconOnly={true} />
            </Link>

            <Link href={`/${lang!}/search`}>
              {/* <Input
                    type="search"
                    placeholder={t('placeholder')}
                    value=""
                    
                    inputClassName={` ${isStickyVisible ? 
                      `hover:border-none focus:border-none focus:outline-none focus:ring-none border-none  placeholder:text-white` 
                      : 
                      `hover:border-none focus:border-none focus:outline-none focus:ring-none border-none  placeholder:text-white`
                    } placeholder:text-white`}  // تغيير لون الـ placeholder هنا
                    className={`w-72  ${isStickyVisible?"placeholder:text-yellow-400 placeholder-shown:text-yellow-300":"placeholder:text-yellow-400"}`}
                    prefix={
                    }
                  /> */}
              <IoSearchOutline className="h-5  w-5" />
            </Link>
            <LanguageSwitcher
              lang={lang!}
              className=" rounded-none shadow-none"
              variant="icon"
            />
            <Link href={`/${lang!}/cart`}>
              <ShoppingCart className={`transition duration-150  ${isStickyVisible ? "hover:text-black" : "hover:text-mainColor"}`} />

            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className={`transition duration-150 ${isStickyVisible ? "hover:text-black" : "hover:text-mainColor"}`}
            >
              <AlignCenter />
            </button>

            <AnimatePresence mode="wait">
              {isOpen && <SideNav lang={lang!} isOpen={isOpen} setIsOpen={setIsOpen} />}
            </AnimatePresence>

          </div>
          <HeaderMenuRight />
        </div>
      </div>
    </StickyHeader>
    <div>
      <div className={`flex lg:hidden ${isStickyVisible
        ? "fixed top-0 z-50 w-full bg-white  "
        : "hidden"}`}>
        <div className="w-5/6 mx-auto flex justify-between h-16  items-center">
          <Link href={`/${lang}/`}>
            <h2 className='text-base'>{shopName}</h2>
          </Link>
          <div className="  flex justify-between items-center">
            <div className="flex gap-5">
              <LanguageSwitcher
                lang={lang!}
                className="ms-3 rounded-none shadow-none"
                variant="icon"
              />
              <Link href={`/${lang!}/search`}>
                <IoSearchOutline size={20} />
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className={`transition duration-150 ${isStickyVisible ? "hover:text-black" : "hover:text-mainColor"}`}
              >
                <AlignCenter />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* <div className={`imgBg  lg:hidden `}>
  <div className={`w-10/12 mx-auto mt-5 flex justify-between items-center ${isStickyVisible ? "hidden  " : " "}`}>
    <LanguageSwitcher
      lang={lang!}
      className="ms-3 rounded-none shadow-none"
      variant="text"
    />
    <div className="flex gap-5">
      <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
        <IoSearchOutline  className="w-5 " />    
      </div>
      <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
        <User className=" w-5 " />    
      </div>
    </div>
  </div>
</div> */}
    {background && !pathname || pathname === "/en" || pathname === "/ar" || pathname === "/" ? (
      <div className={`imgBg lg:hidden`}
        style={{
          backgroundImage: background ? `url(${background})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          height: "200px",
          zIndex: 2,
        }}
      >
        <div
          className={`w-10/12 mx-auto mt-5 flex justify-between items-center ${isStickyVisible ? "hidden" : ""
            }`}
        >
          <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
            <Link href={`/${lang!}/search`}>
              <IoSearchOutline size={20} />
            </Link>
          </div>
          <div className="flex gap-5">
            <div className="w-10 h-10  bg-white rounded-full flex justify-center items-center">
              <LanguageSwitcher
                lang={lang!}
                className=" rounded-none shadow-none"
                variant="icon"
              />
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
              <button
                onClick={() => setIsOpen(true)}
                className={`transition duration-150 ${isStickyVisible ? "hover:text-black" : "hover:text-mainColor"}`}
              >
                <AlignCenter />
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <div className={`flex lg:hidden fixed top-0 z-[999] w-full bg-white`}>
          <div className="w-5/6 mx-auto flex justify-between h-16 items-center">
            <Link href={`/${lang}/`}>
              <h2 className='text-base'>{shopName}</h2>
            </Link>
            <div className="  flex justify-between items-center">
              <div className="flex gap-5">
                <LanguageSwitcher
                  lang={lang!}
                  className="ms-3 rounded-none shadow-none"
                  variant="icon"
                />
                <Link href={`/${lang!}/search`}>
                  <IoSearchOutline size={20} />
                </Link>
                <button
                  onClick={() => setIsOpen(true)}
                  className={`transition duration-150 ${isStickyVisible ? "hover:text-black" : "hover:text-mainColor"}`}
                >
                  <AlignCenter />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>

}
