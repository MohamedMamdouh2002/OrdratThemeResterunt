'use client'
import React, { useEffect, useState } from 'react'
import { Car, CircleAlert, Info, Star, TicketPercentIcon, Timer } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faMoneyBills, faX } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../fetch/api';
import { useUserContext } from '../context/UserContext';
import { API_BASE_URL } from '@/config/base-url';
import map from '@public/assets/map.png'

import toast from 'react-hot-toast';
import Image from 'next/image';
import { IoMdClose } from 'react-icons/io';


type Branchprops = {
    name: string;
    addressText: string;
    openAt: string;
    closedAt: string;
    deliveryTime: string;

}

function Navbar({ className, lang }: { className?: string, lang?: string }) {
    const { t, i18n } = useTranslation(lang!, 'nav');
    const [isWideScreen, setIsWideScreen] = useState(typeof window !== "undefined" ? window.innerWidth > 1180 : true);
    const [response, setResponse] = useState<Branchprops[]>([]);
    const [modal, setModal] = useState(false);
    const [coupon, setCoupon] = useState<[] | null>([]);
    const [description, setDescription] = useState<string | null>(null);
    const [rate, setrate] = useState<any | null>(null);

    const { shopId } = useUserContext();
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        // console.log('Current shopId:', shopId);
      }, [shopId]);
      
    useEffect(() => {
        if (modal && isWideScreen) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [modal, isWideScreen]);

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            if (!shopId) return; 
      
            const response = await axiosClient.get(`/api/Branch/GetByShopId/${shopId}`, {
              headers: {
                'Accept-Language': lang,
              },
            });
            setResponse(response.data);
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
      
        fetchOrders();
      }, [lang, shopId]); // 👈 خليه يراقب shopId كمان
      
    useEffect(() => {
        async function fetchData() {
          if (!shopId) return; // لو لسه مش موجود متعملش حاجة
      
          try {
            const response = await fetch(`${API_BASE_URL}/api/Coupon/GetAll/${shopId}?PageNumber=1&PageSize=500`);
            const data = await response.json();
            console.log('dataCoupon/GetAll', data);
            console.log('dataCoupon/GetAll111111', shopId);
            
            setCoupon(data.entities);
          } catch (error) {
            console.error("حدث خطأ أثناء جلب البيانات:", error);
          }
        }
      
        fetchData();
      }, [shopId]); // 👈 حطينا shopId هنا ك dependency
      

    useEffect(() => {
        i18n.changeLanguage(lang);

        const description = localStorage.getItem("description");
        const rate = localStorage.getItem("rate");
        if (description) {

            setDescription(description)
            setrate(rate)
        }
    }, [lang, i18n]);

    return (
        <>
            <div className="hidden lg:block h-14 bg-mainColor text-white text-sm relative">
                <div className="w-[90%] mx-auto grid grid-cols-9 *:col-span-3 items-center justify-between py-2">
                    {
                        (() => {
                            const banners = coupon?.filter((i: any) => i.isBanner === true && i.isActive === true).slice(-1);

                            return banners && banners.length > 0 ? (
                                banners.map((banner: any) => (
                                    <div
                                        key={banner.id}
                                        onClick={() => {
                                            navigator.clipboard.writeText(banner.code);
                                            toast.success(t('code'));
                                        }}
                                        className="flex items-center gap-3 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 ">
                                            <TicketPercentIcon className='w-5' />
                                            <span>{t('select-item')}</span>
                                        </div>
                                        <div className="border-2 border-white rounded-lg text-white p-2">
                                            {t('copy')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // عنصر بديل محجوز بنفس الحجم
                                <div className="flex items-center gap-3 invisible">
                                    <div className="flex items-center gap-3 ">
                                        <TicketPercentIcon className='w-5' />
                                        <span>{t('select-item')}</span>
                                    </div>
                                    <div className="border-2 border-white rounded-lg text-white p-2">
                                        {t('copy')}
                                    </div>
                                </div>
                            );
                        })()
                    }

                    <div className="flex items-center mx-auto gap-5">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMoneyBills as any} className="w-5" />
                            {t('Cash')}
                        </div>
                    </div>

                    <div className="flex items-center gap-5 justify-end w-full col-span-3 relative">
                        <div className={'flex items-center gap-1 text-sm'}>
                            <Star className="fill-[#f1d045] text-[#f1d045]" size={14} />
                            <span className="">{rate}</span>
                            <Link href={`/${lang!}/reviews`} className="underline font-light">
                                (<bdi>{t('showRate')}</bdi>)
                            </Link>
                        </div>
                        <div className="relative">
                            <Info
                                size={16}
                                onClick={() => setModal(true)}
                                className="cursor-pointer text-base relative z-10"
                            />
                        </div>
                    </div>
                </div>

                {modal && (
                    <div
                        onClick={() => setModal(false)}
                        className="fixed top-0 left-0 w-full h-full z-[999999] hidden lg:flex justify-center items-center bg-black/50"
                    >
                        <div
                            onClick={(event) => event.stopPropagation()}
                            className="sm:w-[500px] w-[340px] min-h-96 bg-white p-5 rounded-lg shadow-lg flex flex-col max-h-[700px]"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{t('shopInfo')}</h2>
                                <button
                                    onClick={() => setModal(false)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <IoMdClose className='hover:text-mainColorHover text-xl' />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto pe-5 max-h-[300px]">
                                <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('aboutShop')}</h4>
                                <div className="p-3 rounded-lg text-black bg-[#F2F4F7]">
                                    <p>
                                        {description}
                                    </p>
                                </div>
                                {response
                                    .filter((i) => i.name === "Main Branch" || i.name === "الفرع الرئيسي")
                                    .map((i, index) => {
                                        const formatTime = (time: any) => {
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
                                            <div key={index}>
                                                <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('TimeShop')}</h4>
                                                <div className="p-3  rounded-lg text-black bg-[#F2F4F7]">
                                                    <p>
                                                        {lang === 'ar' ? 'من' : 'from'}{" "}
                                                        {formatTime(i.openAt)}
                                                        {" "}
                                                        {lang === 'ar' ? 'الي' : 'to'}
                                                        {" "}
                                                        {formatTime(i.closedAt)}
                                                    </p>
                                                </div>

                                                {/* وقت التوصيل */}
                                                <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('deliveryShop')}</h4>
                                                <div className="p-3 flex items-center justify-between rounded-lg text-black bg-[#F2F4F7]">
                                                    <p>
                                                        {i.deliveryTime}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}




                                <div className="text-[#212121] mt-5 space-y-4 mb-2">
                                    <h2 className="text-black font-medium mt-4 mb-2 text-sm">{lang === 'ar' ? 'الفروع' : 'Branches'}</h2>

                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {response.map((i, index) => (
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

                            <button onClick={() => setModal(false)}
                                className='w-full h-11 rounded-lg text-xl text-white bg-mainColor mt-auto'>
                                {t('done')}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

export default Navbar;
