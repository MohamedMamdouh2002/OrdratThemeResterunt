"use client"
// import { Info, Link, Search, Share2, Star, TicketPercentIcon, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { } from 'rizzui'
import logo from '@public/assets/karam-el-sham.png'
import LanguageSwitcher from '@/app/i18n/language-switcher'
import { PiMagnifyingGlassBold } from 'react-icons/pi'
import { useTranslation } from '@/app/i18n/client'
import { Car, CircleAlert, Info, Star, TicketPercentIcon, Timer } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMoneyBills, faX } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'
import { API_BASE_URL } from '@/config/base-url'
import { useUserContext } from '../context/UserContext'
import toast from 'react-hot-toast'
import axiosClient from '../fetch/api'
import map from '@public/assets/map.png'


type Branchprops = {
    name: string;
    addressText: string;
}
function RestaurantTitle({ lang }: { lang?: string; }) {
    const { t, i18n } = useTranslation(lang!, 'nav');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [shopName, setShopName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [coupon, setCoupon] = useState<[] | null>([]);
    const [response, setResponse] = useState<Branchprops[]>([]);
    const { shopId } = useUserContext();

    console.log("logoUrl: ", logoUrl);

    useEffect(() => {
        i18n.changeLanguage(lang);
        const storedLogo = localStorage.getItem("logoUrl");
        const storedName = localStorage.getItem("subdomainName");
        const description = localStorage.getItem("description");
        if (storedLogo) {
            setLogoUrl(storedLogo);
            setShopName(storedName);
            setDescription(description)
        }
    }, [lang, i18n]);
    const [modal, setModal] = useState(false);



    useEffect(() => {
        if (modal) {
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
    }, [modal]);
    useEffect(() => {
        async function fetchData() {

            try {
                let response = await fetch(`${API_BASE_URL}/api/Coupon/GetAll/${shopId}`);
                const data = await response.json();
                console.log('data', data);
                // const banners = data.entities.filter((i: any) => i.isBanner === true);
                setCoupon(data.entities);
            } catch (error) {
                console.error("حدث خطأ أثناء جلب البيانات:", error);
            }

        }
        fetchData()
    }, []);
    useEffect(() => {
        i18n.changeLanguage(lang);

        const description = localStorage.getItem("description");
        if (description) {

            setDescription(description)
        }
    }, [lang, i18n]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // setLoading(true);
                const response = await axiosClient.get(`/api/Branch/GetByShopId/${shopId}`, {
                    headers: {
                        'Accept-Language': lang,
                    },
                });
                setResponse(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                // setLoading(false);
            }
        };

        fetchOrders();
    }, [lang]);
    return <>

        <div className={'flex lg:hidden -mt-20 rounded-xl flex-col  bg-slate-50 w-5/6 mx-auto z-10 text-black relative'}>
            <div className="flex items-start mt-6 justify-between">
                <div className="flex gap-6 items-start">
                    {/* <Image src={logo} width={100} height={100} className='-mt-5 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]' alt='logo' /> */}
                    {logoUrl ? (
                        <div className="w-[100px] h-[80px] mt-5 ms-3  ">
                            <Image
                                src={logoUrl}
                                width={100}
                                height={100}
                                className="-mt-5 w-full h-full"
                                alt="logo"
                            />
                        </div>
                    ) : (
                        <div className="w-[100px] h-[100px] bg-gray-200 rounded-full"></div>
                    )}
                    <div className="">
                        <h1 className='text-base'>{shopName}</h1>
                        <h2 className='xs:text-sm text-xs font-normal truncate-text '>{description}</h2>
                        <div className={'flex items-center gap-1 text-sm'}>
                            <Star className="fill-[#f1d045] text-[#f1d045]" size={14} />
                            <span className="">4.3</span>
                            <Link href={`/${lang!}/reviews`} className="underline font-light">
                                (<bdi>{t('showRate')}</bdi> )
                                {/* {t('ratings')}) */}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 me-5">
                    <Info size={16}

                        onClick={() => setModal(true)}
                        className="cursor-pointer text-base relative z-10"
                    />

                </div>
            </div>
            <div className="flex flex-col  w-5/6 mx-auto py-5  z-10 rounded-lg">
                <div className="flex pt-2">
                    <div className="basis-1/3 flex flex-col items-center justify-center font-light text-sm border-e pe-2">
                        <strong className="font-light text-stone-800 text-center text-xs">
                            {t('deliveryFee')}
                        </strong>
                        <span className=" font-light text-xs"> 33.99</span>
                    </div>
                    <div className="basis-1/3 flex flex-col items-center justify-center border-e px-2">
                        <strong className="text-stone-800 text-center font-light text-xs">
                            {t('delivery-Time')}
                        </strong>
                        <span className="text-xs font-light">60 {t('mins')}</span>
                    </div>
                    <div className="basis-1/3 flex flex-col items-center justify-center">
                        <strong className="font-light text-stone-800 text-center text-xs">
                            deliveryBy
                        </strong>
                        <span className="flex items-center gap-1">
                            <span className="text-xs font-light text-center">{t('Restaurant')}</span>
                            <Info className="text-stone-700" size={14} />
                        </span>
                    </div>
                </div>
            </div>


        </div>
        {coupon?.filter((i: any) => i.isBanner === true && i.isActive === true)
            .slice(-1)
            .map((banner: any) => (
                <div
                    key={banner.id}
                    className="flex lg:hidden bg-mainColorHover w-5/6 text-white items-center gap-3 mt-5 rounded-lg mx-auto px-4 h-16 cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(banner.code);
                        toast.success(t('code'));
                    }}
                >
                    <TicketPercentIcon />
                    <span> {t('select-item')}</span>
                </div>
            ))
        }

        {modal && (
            <div
                onClick={() => setModal(false)}
                className="fixed top-0 left-0 w-full h-full z-[999999] lg:hidden flex justify-center items-center bg-black/50"
            >
                <div
                    onClick={(event) => event.stopPropagation()}
                    className="sm:w-[500px] w-[340px] bg-white py-5 ps-5 rounded-lg shadow-lg flex flex-col max-h-[600px]"
                >
                    <div className="flex justify-between pe-5 pb-2 items-center">
                        <h2 className="text-xl font-semibold">{t('shopInfo')}</h2>
                        <button
                            onClick={() => setModal(false)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <FontAwesomeIcon icon={faX as any} className='text-xl' />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto pe-5 max-h-[300px]">
                        <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('aboutShop')}</h4>
                        <div className="p-3 rounded-lg text-black bg-[#F2F4F7]">
                            <p>
                               {description}
                            </p>
                        </div>

                        <div className="text-[#212121] mt-5 space-y-4 mb-2">
                            <h2 className="text-black font-medium mt-4 mb-2 text-sm">{lang === 'ar' ? 'الفروع' : 'Branches'}</h2>

                            <div className="flex flex-wrap gap-4 justify-start">
                                {response.map((i, index) => (
                                    <div key={index} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-28">
                                        <Image src={map} className='w-10' alt={i.name} />
                                        <span className="text-sm font-medium text-[#212121] mt-2">{i.name}</span>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i.addressText)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-mainColor hover:underline bg-mainColor py-2 text-sm text-white w-11/12 mx-auto justify-center text-center rounded-md mt-3"
                                        >
                                            {lang === 'ar' ? 'عرض' : 'View'}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pe-5 pt-2">

                        <button onClick={() => setModal(false)}
                            className='w-full h-11 rounded-lg text-xl text-white bg-mainColor mt-auto'>
                            {t('done')}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </>
}

export default RestaurantTitle