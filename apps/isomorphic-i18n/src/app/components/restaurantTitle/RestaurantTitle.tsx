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

type props = {
    icon: any;
    title: string;
}
function RestaurantTitle({ lang }: { lang?: string;}) {    
    const { t, i18n } = useTranslation(lang!, 'nav');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [shopName, setShopName] = useState<string | null>(null);
    console.log("logoUrl: ",logoUrl);
    
    useEffect(() => {
        i18n.changeLanguage(lang);
        const storedLogo = localStorage.getItem("logoUrl");
        const storedName = localStorage.getItem("subdomainName");
        if (storedLogo) {
            setLogoUrl(storedLogo);
            setShopName(storedName);
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
    const descriptions: props[] = [
        { title: t('Cash'), icon: faMoneyBills },
        { title: t('work'), icon: faClock },
        { title: t('work'), icon: faClock },
    ];
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
                        <h2 className='xs:text-sm text-xs font-normal truncate-text '>{t('desc')}</h2>
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
        <div className="flex lg:hidden bg-mainColorHover w-5/6  text-white items-center gap-3 mt-5 rounded-lg mx-auto px-4 h-16">
            <TicketPercentIcon /><span>{t('select-item')}</span>
        </div>
        {modal && (
            <div
                onClick={() => setModal(false)}
                className="fixed top-0 left-0 w-full h-full z-[999999] lg:hidden flex justify-center items-center bg-black/50"
            >
                <div
                    onClick={(event) => event.stopPropagation()}
                    className="sm:w-[500px] w-[340px] min-h-96 bg-white p-5 rounded-lg shadow-lg flex flex-col"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{t('shopInfo')}</h2>
                        <button
                            onClick={() => setModal(false)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <FontAwesomeIcon icon={faX as any} className='text-xl' />
                        </button>
                    </div>

                    <div className="flex-grow">
                        <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('aboutShop')}</h4>
                        <div className="p-3 rounded-lg text-black bg-[#F2F4F7]">
                            <p>{t('desc')}</p>
                        </div>
                        <div className="text-[#212121] mt-5 space-y-4 mb-2">
                            {descriptions.map((i, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={i.icon} />
                                    <p className='text-base'>{i.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                <button 
                    onClick={() => setModal(false)}
                 className='w-full h-11 rounded-lg text-xl text-white bg-mainColor mt-auto'>
                        {t('done')}
                    </button>
                </div>
            </div>
        )}
    </>
}

export default RestaurantTitle