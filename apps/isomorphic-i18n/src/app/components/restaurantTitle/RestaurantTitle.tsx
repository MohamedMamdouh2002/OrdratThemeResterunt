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
import { IoMdClose } from 'react-icons/io'
// import useCurrencyAbbreviation, { toCurrency } from '@utils/to-currency'
import CustomImage from '../ui/CustomImage'
import Skeleton from 'react-loading-skeleton'
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'


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
    background,
    coupon,
    branch,
    description
}: {
    lang?: string;
    logoUrl: string | null;
    shopName: string | null;
    background: string | null;
    coupon: any | null;
    branch: Branchprops[] | null;
    description: string | null;
    shopId: string | null;
    currencyName: string;
}) {
    const { t, i18n } = useTranslation(lang!, 'nav');
    const [rate, setrate] = useState<any | null>(null);
    const [branches, setBranches] = useState<Branchprops[]>(branch ?? []);
    const [coupons, setCoupons] = useState<any[]>(coupon ?? []);

    const [shopData, setShopData] = useState({
        logoUrl: logoUrl || '',
        shopName: shopName || '',
        description: description || '',
        currencyName: currencyName || '',

    });
    // const abbreviation = useCurrencyAbbreviation({ lang } as any);
    // console.log("logoUrl: ", logoUrl);
    useEffect(() => {
        i18n.changeLanguage(lang);

        const isValidServerData =
            shopId?.trim() &&
            logoUrl?.trim() &&
            shopName?.trim() &&
            description?.trim();

        if (isValidServerData) {
            setShopData({
                logoUrl: logoUrl!,
                shopName: shopName!,
                description: description!,
                currencyName: currencyName || '',
            });

            localStorage.setItem('logoUrl', logoUrl!);
            localStorage.setItem('subdomainName', shopName!);
            localStorage.setItem('backgroundUrl', background || '');
            localStorage.setItem('description', description!);
            localStorage.setItem('currencyAbbreviation', currencyName!);
        } else {
            const storedLogo = localStorage.getItem('logoUrl');
            const storedName = localStorage.getItem('subdomainName');
            const storedBackground = localStorage.getItem('backgroundUrl');
            const storedDescription = localStorage.getItem('description');
            const currencyAbbreviation = localStorage.getItem('currencyAbbreviation');

            setShopData({
                logoUrl: storedLogo || '',
                shopName: storedName || '',
                description: storedDescription || '',
                currencyName: currencyAbbreviation || '',
            });
        }

        const storedRate = localStorage.getItem("rate");
        setrate(storedRate ? Number(storedRate) : 0);
    }, [lang, shopId, logoUrl, shopName, description]);

    const [modal, setModal] = useState(false);
    useEffect(() => {
  // Fallback fetch for branches
  if (!branch || branch.length === 0) {
    fetch(`${API_BASE_URL}/api/Branch/GetByShopId/${shopId}`, {
      headers: {
        'Accept-Language': lang!,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBranches(data); // محتاج تعمل useState للـ branch
        }
      })
      .catch((error) => {
        console.error("Error fetching branches from client:", error);
      });
  } else {
    setBranches(branch);
  }

  // Fallback fetch for coupons
  if (!coupon || coupon.length === 0) {
    fetch(`${API_BASE_URL}/api/Coupon/GetAll/${shopId}?PageNumber=1&PageSize=500`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.entities) {
          setCoupons(data.entities); // محتاج تعمل useState للـ coupon
        }
      })
      .catch((error) => {
        console.error("Error fetching coupons from client:", error);
      });
  } else {
    setCoupons(coupon);
  }
}, [shopId, lang]);

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
    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             let response = await fetch(`${API_BASE_URL}/api/Coupon/GetAll/952E762C-010D-4E2B-8035-26668D99E23E`);
    //             const data = await response.json();
    //             console.log('data', data);
    //             // const banners = data.entities.filter((i: any) => i.isBanner === true);
    //             setCoupon(data.entities);
    //         } catch (error) {
    //             console.error("حدث خطأ أثناء جلب البيانات:", error);
    //         }

    //     }
    //     fetchData()
    // }, []);
    // useEffect(() => {
    //     i18n.changeLanguage(lang);

    //     const description = localStorage.getItem("description");
    //     if (description) {

    //         setDescription(description)
    //     }
    // }, [lang, i18n]);
    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         try {
    //             // setLoading(true);
    //             const response = await axiosClient.get(`/api/Branch/GetByShopId/952E762C-010D-4E2B-8035-26668D99E23E`, {
    //                 headers: {
    //                     'Accept-Language': lang,
    //                 },
    //             });
    //             setResponse(response.data);
    //         } catch (error) {
    //             console.error('Error fetching orders:', error);
    //         } finally {
    //             // setLoading(false);
    //         }
    //     };

    //     fetchOrders();
    // }, [lang]);
    return <>
        <div className={'flex lg:hidden -mt-24 rounded-xl flex-col  bg-slate-50 w-5/6 mx-auto z-10 text-black relative'}>
            <div className="flex items-start mt-6 justify-between">
                <div className="flex gap-4 items-start">
                    {/* <Image src={logo} width={100} height={100} className='-mt-5 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]' alt='logo' /> */}

                    {shopData.logoUrl ? (
                        <div className="w-[100px] h-[80px] mt-5 ms-3  shrink-0">
                            <CustomImage
                                src={shopData.logoUrl}
                                width={100}
                                height={100}
                                className="-mt-5 w-full h-full"
                                alt="logo"
                            />
                        </div>
                    ) : (
                        <div className="w-[60px] h-[80px]  ms-3 rounded-lg overflow-hidden">
                            <Skeleton width="100%" height="100%" />
                        </div>
                    )}
                    <div className="">
                        <h2 className={`text-base `}>
                            {shopData.shopName ? shopData.shopName : <Skeleton width={20} height={20} />}
                        </h2>
                        <h2 className='xs:text-sm text-xs font-normal truncate-text '>{shopData.description ? shopData.description : <Skeleton width={100} height={20} className='mt-3' />} </h2>
                        <div className={'flex items-center gap-1 text-sm'}>
                            <Star className="fill-[#f1d045] text-[#f1d045]" size={14} />
                            {rate === 0 ? (
                                <span>{lang === 'ar' ? 'لا يوجد تقييم' : 'No Rating'}</span>
                            ) : (
                                <>
                                    <span>{rate}</span>
                                    <Link href={`/${lang}/reviews`} className="underline font-light">
                                        (<bdi>{t('showRate')}</bdi>)
                                    </Link>
                                </>
                            )}
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
                        <strong className="font-light text-stone-800 text-center text-xs ">
                            {t('deliveryFee')}
                        </strong>
                        <span className="text-sm font-light text-center mt-2">

                            {(() => {
                                const mainBranch = branches?.find(
                                    (i) => i.name === "Main Branch" || i.name === "الفرع الرئيسي"
                                );

                                if (!mainBranch) {
                                    return <span>{lang === "ar" ? "غير متاح" : "Not available"}</span>;
                                }

                                if (mainBranch.isFixedDelivery && mainBranch?.deliveryCharge === 0) {
                                    return <span>{lang === 'ar' ? 'مجانا' : 'Free'}</span>;
                                }
                                if (mainBranch.isFixedDelivery) {
                                    // return <span>{abbreviation && toCurrency(
                                    //     ?? 0, lang as any, abbreviation)}</span>;
                                    { mainBranch.deliveryCharge }
                                }

                                return (
                                    <span className='flex items-center gap-1'>
                                        {/* {abbreviation && toCurrency(
                                            ?? 0, lang as any, abbreviation)} {lang === "ar" ? "/كيلو" : "/km"} */}
                                        {mainBranch.deliveryPerKilo}{shopData.currencyName === 'ر.س' ? <Image src={sarIcon} alt="SAR" width={10} height={10} /> : shopData.currencyName}
                                    </span>
                                );
                            })()}
                        </span>
                    </div>
                    <div className="basis-1/3 flex flex-col items-center justify-center border-e px-2">
                        <strong className="text-stone-800 text-center font-light text-xs">
                            {t('delivery-Time')}
                        </strong>
                        {branches?.some(i => i.name === "Main Branch" || i.name === "الفرع الرئيسي") ? (
                            branch
                                ?.filter(i => i.name === "Main Branch" || i.name === "الفرع الرئيسي")
                                .map((i, index) => (
                                    <p key={index} className="text-sm mt-2 text-black">
                                        {i.deliveryTime}
                                    </p>
                                ))
                        ) : (
                            <p className="text-sm mt-2 text-black">
                                {lang === 'ar' ? '10 دقائق' : '10 minutes'}
                            </p>
                        )}
                    </div>
                    <div className="basis-1/3 flex flex-col items-center justify-center ms-1">
                        <strong className="font-light text-stone-800 text-center text-xs ">
                            {lang === 'ar' ? 'توصيل بواسطة' : 'delivery By'}
                        </strong>
                        <span className="text-sm font-light text-center mt-2">{lang === 'ar' ? 'المتجر' : 'Store'}</span>
                        <span className="flex items-center gap-1">
                            {/* <Info className="text-stone-700" size={14} /> */}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        {coupons?.filter((i: any) => i.isBanner === true && i.isActive === true)
            .slice(-1)
            .map((banner: any) => (
                <div
                    key={banner.id}
                    className="flex  justify-between lg:hidden bg-mainColorHover w-5/6 text-white items-center gap-3 mt-5 rounded-lg mx-auto px-4 h-16 cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(banner.code);
                        toast.success(t('code'));
                    }}
                >
                    <div className="flex items-center gap-3">
                        <TicketPercentIcon />
                        <span> {t('select-item')}</span>
                    </div>
                    <div className="border-2 border-white rounded-lg text-white p-2">
                        {t('copy')}
                    </div>
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
                            <IoMdClose className='hover:text-mainColorHover text-xl' />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto pe-5 max-h-[300px]">
                        <h4 className='text-black font-medium mt-4 mb-2 text-sm'>{t('aboutShop')}</h4>
                        <div className="p-3 rounded-lg text-black bg-[#F2F4F7]">
                            <p>
                                {shopData.description}
                            </p>
                        </div>
                        {branch?.filter((i) => i.name === "Main Branch" || i.name === "الفرع الرئيسي")
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
                                {branches?.map((i, index) => (
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