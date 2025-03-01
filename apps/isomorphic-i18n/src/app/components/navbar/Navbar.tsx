'use client'
import React, { useEffect, useState } from 'react'
import { Car, CircleAlert, Info, Star, TicketPercentIcon, Timer } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faMoneyBills, faX } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../fetch/api';
import { useUserContext } from '../context/UserContext';

type Branchprops = {
    name: string;
    addressText: string;
}

function Navbar({ className, lang }: { className?: string, lang?: string }) {
    const { t, i18n } = useTranslation(lang!, 'nav');
    const [isWideScreen, setIsWideScreen] = useState(typeof window !== "undefined" ? window.innerWidth > 1180 : true);
    const [response, setResponse] = useState<Branchprops[]>([]);
    const [modal, setModal] = useState(false);
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

    return (
        <>
            <div className="hidden lg:block h-14 bg-mainColor text-white text-sm relative">
                <div className="w-[90%] mx-auto grid grid-cols-9 *:col-span-3 items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <TicketPercentIcon /><span>{t('select-item')}</span>
                    </div>
                    <div className="flex items-center mx-auto gap-5">
                        <div className="flex items-center gap-">
                            <Timer /> 24 {t('mins')}
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMoneyBills as any} className='text-lg' />
                            {t('Cash')}
                        </div>
                    </div>
                    <div className="flex items-center gap-5 justify-end w-full col-span-3 relative">
                        <div className={'flex items-center gap-1 text-sm'}>
                            <Star className="fill-[#f1d045] text-[#f1d045]" size={14} />
                            <span className="">4.3</span>
                            <Link href={`/${lang!}/reviews`} className="underline font-light">
                                (<bdi>{t('showRate')}</bdi> )
                                {/* {t('ratings')}) */}
                            </Link>
                        </div>
                        <div className="relative">
                            <Info size={16}

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
                                    {response.map((i, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i.addressText)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mainColor hover:underline">
                                               <FontAwesomeIcon icon={faMapMarkerAlt as any} className="text-xl" />
                                                <span>{i.name}</span>
                                            </a>
                                        </div>
                                    ))}
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
