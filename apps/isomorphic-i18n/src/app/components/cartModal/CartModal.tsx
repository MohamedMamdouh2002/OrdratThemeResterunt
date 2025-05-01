'use client';
import React, { useState, useEffect } from 'react';
import { faCartShopping, faTrashCan, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/app/i18n/client';
import Image from 'next/image';
import Link from 'next/link';
// import { useUserContext } from '../../context/UserContext';
import { usePathname } from 'next/navigation';
import { useUserContext } from '../context/UserContext';
import CartProduct from '@/app/shared/ecommerce/cart/cart-product';
import { Empty, EmptyProductBoxIcon, Tooltip } from 'rizzui';
import { useCart } from '@/store/quick-cart/cart.context';
import { CiDiscount1, CiShoppingCart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import CouponModal from '../modalCoupon/ModalCoupon';
import { MdLocalOffer } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import useCurrencyAbbreviation, { toCurrency } from '@utils/to-currency';

const ProgressBar = ({ totalPrice, freeShippingThreshold }: { totalPrice: number; freeShippingThreshold: number; }) => {
    const [progress, setProgress] = useState(0);
    const percentage = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
    
    useEffect(() => {
        // Animate the progress bar when the component mounts
        const timeout = setTimeout(() => {
            setProgress(percentage);
        }, 100); // Delay to ensure animation starts smoothly

        return () => clearTimeout(timeout);
    }, [percentage]);

    return (
        <div className="w-full px-4 my-4 ltr">
            <div className="w-full h-2 bg-gray-200 rounded-full relative">
                <div
                    className={`relative h-2 ${progress == 100 ? 'bg-green-700' : 'bg-red-500'} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${progress}%` }}
                >
                    <span
                        className={`absolute top-1/2 right-1 translate-x-1/2 -translate-y-1/2 text-xs font-bold ${progress == 100 ? 'text-green-700 border-green-700' : 'text-red-500 border-red-500'} bg-white border-2 rounded-full w-9 h-9 flex items-center justify-center`}
                    >
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>
        </div>
    );
};


const FreeShippingMessage = ({ totalPrice, freeShippingThreshold, lang }: { totalPrice: number; freeShippingThreshold: number; lang: string; }) => {
    const { t } = useTranslation(lang, 'home');
    const abbreviation = useCurrencyAbbreviation({ lang: lang });
    const remainingAmount = Math.max(freeShippingThreshold - totalPrice, 0);

    return (
        <div className="max-w-[550px] mx-auto text-center text-sm sm:text-base leading-snug font-normal my-2 sm:my-4">
            {remainingAmount > 0 ? (
                <>
                    {t('spend')} {" "}
                    <span className="text-red-500 font-bold">
          {abbreviation && toCurrency(remainingAmount.toLocaleString(), lang, abbreviation)}

                        {/* {remainingAmount.toLocaleString()} <span>{t('currency')}</span> */}
                    </span>{" "}
                    {t('more_to_reach')} <strong>{t('free_shipping')}</strong>
                </>
            ) : (
                <span className="text-green-600 font-bold">{t('congrats_free_shipping')}</span>
            )}
        </div>
    );
};

function CartModal({ lang }: { lang?: string }) {
    const { t } = useTranslation(lang!, "home");
    const [modal, setModal] = useState(false);
    const [productDetailsArray, setProductDetailsArray] = useState([]);
    const { userData, setUserData } = useUserContext();
    const pathname = usePathname();
    const [showCouponModal, setShowCouponModal] = useState(false);
    const coupon = JSON.parse(localStorage.getItem("showAllCouponsInSideBar") ?? "false");
    const free_shipping = JSON.parse(localStorage.getItem("applyFreeShppingOnTarget") ?? "false");
    const currencyName = localStorage.getItem("currencyName");
    const loadProductDetails = () => {
        const data = JSON.parse(localStorage.getItem('productDetails') || '[]');
        setProductDetailsArray(data);
    };
    const abbreviation = useCurrencyAbbreviation({ lang } as any);

    useEffect(() => {
        loadProductDetails();
        if (userData === true) {
            loadProductDetails();
            setUserData(false);
        }
    }, [userData]);

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modal]);

    useEffect(() => {
        setModal(false);
    }, [pathname]);


    // const handleDeleteItem = (index: number) => {
    //     const updatedArray = productDetailsArray.filter((_: any, i: number) => i !== index);
    //     setUserData(true);
    //     localStorage.setItem('productDetails', JSON.stringify(updatedArray));
    //     loadProductDetails();
    // };
    useEffect(() => {
        const shouldLockScroll = modal || showCouponModal;
        document.body.style.overflow = shouldLockScroll ? 'hidden' : 'auto';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modal, showCouponModal]);


    const closeModal = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === 'modal-overlay') {
            setModal(false);
        }
    };
    const { items } = useCart();
    
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // const freeShippingThreshold = 2000;
    const freeShippingThreshold = localStorage.getItem('freeShppingTarget')

    return (
        <>
            {/* {productDetailsArray.length > 0 && ( */}
            <div className="relative">
                <div
                    onClick={() => setModal(true)}
                    className={`bg-mainColor CartShadow w-[72px] h-16 rounded-lg fixed top-[50%]  z-[999] flex flex-col gap-4 items-center justify-center p-2 cursor-pointer end-2`}
                >
                    <div className="">
                        <CiShoppingCart className="text-white text-2xl text-center mx-auto" />
                        <div className="flex gap-1 items-center ">

                            <p className="text-white text-xs">
                                {items.length}
                            </p>
                            <p className="text-white text-xs">
                                {items.length <= 1 ? t('item') : t('items')}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            {/* )} */}

            {modal && (
                <div
                    id="modal-overlay"
                    onClick={closeModal}
                    className="fixed inset-0 z-[99999] right-0 bg-black bg-opacity-50 flex"
                >
                    <div className="h-full w-[320px] sm:w-[400px] bg-white relative py-4 flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-medium ps-5 ">{t('cart')}</h2>
                            <button
                                onClick={() => setModal(false)}
                                className="text-textColor text-xl mx-3  rounded-lg"
                            >
                                {/* <FontAwesomeIcon icon={faX as any} className='' /> */}
                                <IoMdClose className='hover:text-mainColorHover' />

                            </button>
                        </div>
                        <div className="w-full h-[0.5px] mt-3 bg-[#bfbfbf]"></div>

                        <div className="flex-1 overflow-y-auto pt-3 ps-5  pe-5">
                            {items.length ? (
                                items.map((item) => <CartProduct ifModal={true} key={item.id} product={item} lang={lang} />)
                            ) : (
                                <div className="">

                                    <Empty
                                        image={<EmptyProductBoxIcon className='w-5/12 mx-auto' />}
                                        text={t('cart-empty')}
                                    />
                                </div>
                            )}

                            {/* {productDetailsArray.map((product, index) => (
                                <React.Fragment key={index}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div>
                                            {product.profileImage && (
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    className="w-28 h-28 rounded-lg"
                                                    src={product.profileImage}
                                                    alt="licensePhoto"
                                                />
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex flex-col">
                                                <p>{lang === 'ar' ? product.stockNameAr : product.stockNameEn}</p>
                                                <p>{lang === 'ar' ? product.nameAr : product.nameEn}</p>
                                                <p>{product.PhoneNumber}</p>
                                                <p>{product.Profession}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <button
                                                    // onClick={() => handleDeleteItem(index)}
                                                    className="text-red-500 font-semibold text-sm px-2 py-1 border border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan as any} />
                                                </button>
                                                <div>
                                                    <p>
                                                        {product.stockPrice}
                                                        {lang === 'ar' ? product.stockCurrencySymbolAr : product.stockCurrencySymbolEn}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-[0.5px] bg-textColor my-2"></div>
                                </React.Fragment>
                            ))}
                            {productDetailsArray.length === 0 && (
                                <p className="text-center text-gray-500 mt-4">{t('emptyCart')}</p>
                            )} */}
                        </div>

                        <div className={`sticky bottom-0 left-0 right-0 bg-white pt-3 ${lang == 'ar' ? 'shadow-[rgb(255,255,255)_44px_0px_30px_30px]' : 'shadow-[rgb(255,255,255)_-48px_0px_30px_30px]'}`}>
                            {totalPrice != 0 && (
                                <>
                                    {/* <div className="w-full h-[0.5px] bg-[#7a7a7a] my-2"></div> */}
                                    <div className="flex items-center justify-center border-t border-b border-gray-200 ">
                                        {/* <button
    onClick={() => setShowCouponModal(true)}
    className="flex flex-col items-center text-gray-700 hover:text-mainColor transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 mb-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 6.75h4.374m-7.188 9h9.002M4.5 5.25h15a.75.75 0 01.75.75v1.128a2.25 2.25 0 010 4.344v1.128a2.25 2.25 0 010 4.344V18a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75v-1.128a2.25 2.25 0 010-4.344v-1.128a2.25 2.25 0 010-4.344V6a.75.75 0 01.75-.75z"
      />
    </svg>
    <span className="text-sm font-medium">{lang==='ar'?'كوبون':'Coupon'}</span>
  </button> */}
                                        {/* <Tooltip
                                            size="sm"
                                            content={lang === 'ar' ? 'عرض الكوبونات المتاحة' : 'View available coupons'}
                                            placement="top"
                                            color="success"
                                        >
                                            <button
                                                onClick={() => setShowCouponModal(true)}
                                                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 transition rounded-md cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MdLocalOffer className="text-mainColor w-5 h-5" />
                                                    <span className="font-semibold text-sm text-gray-800">
                                                        {lang === 'ar' ? 'عرض الكوبونات' : 'View coupons'}
                                                    </span>
                                                </div>
                                                <IoIosArrowForward className="text-gray-500 w-4 h-4" />
                                            </button>
                                        </Tooltip> */}

                                        {coupon &&
                                            <button
                                                onClick={() => setShowCouponModal(true)}
                                                className="flex items-center justify-between w-full px-4 py-5 hover:bg-gray-100 transition rounded-md cursor-pointer"
                                            >

                                                <div className="flex items-center gap-2">
                                                    <MdLocalOffer lang={lang} className="text-mainColor w-5 h-5" />
                                                    <span className="font-semibold text-sm text-gray-800">
                                                        {lang === 'ar' ? 'عرض الكوبونات' : 'View coupons'}
                                                    </span>
                                                </div>

                                                {lang === 'ar' ?

                                                    <IoIosArrowForward className="text-gray-500 w-4 h-4 rotate-180" />
                                                    :

                                                    <IoIosArrowForward className="text-gray-500 w-4 h-4" />
                                                }
                                            </button>
                                        }
                                    </div>
                                    {/* <div className="w-full h-[0.5px] bg-[#7a7a7a] my-2"></div> */}
                                    {free_shipping && <>
                                        <ProgressBar totalPrice={totalPrice} freeShippingThreshold={freeShippingThreshold as any} />
                                        <FreeShippingMessage totalPrice={totalPrice} lang={lang!} freeShippingThreshold={freeShippingThreshold as any} />
                                    </>
                                    }
                                </>
                            )}
                            {showCouponModal && (
                                <CouponModal lang={lang!} onClose={() => setShowCouponModal(false)} />

                            )}


                            <Link
                                href={`/${lang}/cart`}
                                className="bg-mainColor text-white rounded-lg text-center text-sm sm:text-base font-medium w-11/12 mx-auto flex justify-between items-center py-2 mt-1 px-4"
                            >
                                <span>{t('order-cart')}</span>
                                <span className='bg-white py-1 px-3 text-mainColor rounded-md'> {abbreviation && toCurrency(totalPrice, lang as any, abbreviation)}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartModal;