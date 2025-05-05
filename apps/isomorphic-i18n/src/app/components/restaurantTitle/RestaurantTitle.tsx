"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { Info, Star, TicketPercentIcon } from 'lucide-react';
import { IoMdClose } from 'react-icons/io'
import Link from 'next/link'
import toast from 'react-hot-toast'
import map from '@public/assets/map.png'
import CustomImage from '../ui/CustomImage'

type Branchprops = {
  name: string;
  addressText: string;
  openAt: string;
  closedAt: string;
  deliveryCharge: number;
  minimumDeliveryCharge: number;
  deliveryPerKilo: number;
  isFixedDelivery: boolean;
  deliveryTime: string;
}

function RestaurantTitle({
  lang,
  shopId,
  logoUrl,
  shopName,
  currencyName,
  rate,
  background,
  coupon,
  branch,
  description
}: {
  lang?: string;
  logoUrl: string | null;
  shopName: string | null;
  rate: string | null;
  background: string | null;
  coupon: any | null;
  branch: Branchprops[] | null;
  description: string | null;
  shopId: string | null;
  currencyName: string;
}) {
  const { t } = useTranslation(lang!, 'nav');
  const [modal, setModal] = useState(false);

  const safeBranches = Array.isArray(branch) ? branch : [];
  const mainBranch = safeBranches.find(
    (i) => i.name === "Main Branch" || i.name === "الفرع الرئيسي"
  );

  useEffect(() => {
    document.documentElement.style.overflow = modal ? 'hidden' : '';
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [modal]);

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const minute = minutes.padStart(2, "0");
    const isPM = hour >= 12;
    const period = isPM ? (lang === 'ar' ? "مساءً" : "PM") : (lang === 'ar' ? "صباحًا" : "AM");
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
  };

  return (
    <>
      <div className='flex lg:hidden -mt-24 rounded-xl flex-col bg-slate-50 w-5/6 mx-auto z-10 text-black relative'>
        <div className="flex items-start mt-6 justify-between">
          <div className="flex gap-6 items-start">
            {logoUrl ? (
              <div className="w-[90px] h-[80px] mt-5 ms-3">
                <CustomImage
                  src={logoUrl}
                  width={100}
                  height={100}
                  className="-mt-5 w-fit h-full"
                  alt="logo"
                />
              </div>
            ) : (
              <div className="w-[100px] h-[100px] bg-gray-200 rounded-full"></div>
            )}
            <div>
              <h2 className='text-base'>{shopName}</h2>
              <h2 className='xs:text-sm text-xs font-normal truncate-text'>{description}</h2>
              <div className='flex items-center gap-1 text-sm'>
                <Star className="fill-[#f1d045] text-[#f1d045]" size={14} />
                <span>{rate}</span>
                <Link href={`/${lang}/reviews`} className="underline font-light">
                  (<bdi>{t('showRate')}</bdi>)
                </Link>
              </div>
            </div>
          </div>
          <div className="flex gap-3 me-5">
            <Info size={16} onClick={() => setModal(true)} className="cursor-pointer text-base relative z-10" />
          </div>
        </div>

        <div className="flex flex-col w-5/6 mx-auto py-5 z-10 rounded-lg">
          <div className="flex pt-2">
            <div className="basis-1/3 flex flex-col items-center justify-center font-light text-sm border-e pe-2">
              <strong className="font-light text-stone-800 text-center text-xs">{t('deliveryFee')}</strong>
              <span className="text-sm font-light text-center mt-2">
                {!mainBranch ? (
                  lang === "ar" ? "غير متاح" : "Not available"
                ) : mainBranch.isFixedDelivery && mainBranch.deliveryCharge === 0 ? (
                  lang === 'ar' ? 'مجانا' : 'Free'
                ) : mainBranch.isFixedDelivery ? (
                  `${mainBranch.deliveryCharge} ${currencyName}`
                ) : (
                  `${mainBranch.deliveryPerKilo} ${currencyName}`
                )}
              </span>
            </div>

            <div className="basis-1/3 flex flex-col items-center justify-center border-e px-2">
              <strong className="text-stone-800 text-center font-light text-xs">{t('delivery-Time')}</strong>
              <p className="text-sm mt-2 text-black">
                {mainBranch ? mainBranch.deliveryTime : (lang === 'ar' ? '10 دقائق' : '10 minutes')}
              </p>
            </div>

            <div className="basis-1/3 flex flex-col items-center justify-center ms-1">
              <strong className="font-light text-stone-800 text-center text-xs">{lang === 'ar' ? 'التوصيل بواسطة' : 'delivery By'}</strong>
              <span className="text-sm font-light text-center mt-2">{t('Restaurant')}</span>
            </div>
          </div>
        </div>
      </div>

      {coupon?.filter((i: any) => i.isBanner && i.isActive).slice(-1).map((banner: any) => (
        <div
          key={banner.id}
          className="flex justify-between lg:hidden bg-mainColorHover w-5/6 text-white items-center gap-3 mt-5 rounded-lg mx-auto px-4 h-16 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(banner.code);
            toast.success(t('code'));
          }}
        >
          <div className="flex items-center gap-3">
            <TicketPercentIcon />
            <span>{t('select-item')}</span>
          </div>
          <div className="border-2 border-white rounded-lg text-white p-2">{t('copy')}</div>
        </div>
      ))}

      {modal && (
        <div onClick={() => setModal(false)} className="fixed top-0 left-0 w-full h-full z-[999999] lg:hidden flex justify-center items-center bg-black/50">
          <div onClick={(event) => event.stopPropagation()} className="sm:w-[500px] w-[340px] bg-white py-5 ps-5 rounded-lg shadow-lg flex flex-col max-h-[600px]">
            <div className="flex justify-between pe-5 pb-2 items-center">
              <h2 className="text-xl font-semibold">{t('shopInfo')}</h2>
              <button onClick={() => setModal(false)} className="text-gray-600 hover:text-gray-900">
                <IoMdClose className='hover:text-mainColorHover text-xl' />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pe-5 max-h-[300px]">
              <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('aboutShop')}</h4>
              <div className="p-3 rounded-lg text-black bg-[#F2F4F7]">
                <p>{description}</p>
              </div>

              {mainBranch && (
                <>
                  <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('TimeShop')}</h4>
                  <div className="p-3 rounded-lg text-black bg-[#F2F4F7]">
                    <p>
                      {lang === 'ar' ? 'من' : 'from'} {formatTime(mainBranch.openAt)} {lang === 'ar' ? 'الي' : 'to'} {formatTime(mainBranch.closedAt)}
                    </p>
                  </div>

                  <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('deliveryShop')}</h4>
                  <div className="p-3 flex items-center justify-between rounded-lg text-black bg-[#F2F4F7]">
                    <p>{mainBranch.deliveryTime}</p>
                  </div>
                </>
              )}

              <div className="text-[#212121] mt-5 space-y-4 mb-2">
                <h2 className="text-black font-medium mt-4 mb-2 text-sm">{lang === 'ar' ? 'الفروع' : 'Branches'}</h2>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {safeBranches.map((i, index) => (
                    <div key={index} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-full">
                      <Image src={map} className="w-10" alt={i.name} />
                      <span className="text-sm font-medium text-[#212121] mt-2">{i.name}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i.addressText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-mainColor hover:underline bg-mainColor py-2 text-sm text-white w-full mx-auto justify-center text-center rounded-md mt-3"
                      >
                        {lang === 'ar' ? 'عرض' : 'View'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pe-5 pt-2">
              <button onClick={() => setModal(false)} className='w-full h-11 rounded-lg text-xl text-white bg-mainColor mt-auto'>
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RestaurantTitle;
