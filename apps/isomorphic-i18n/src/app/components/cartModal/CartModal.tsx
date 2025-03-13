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
import { Empty, EmptyProductBoxIcon } from 'rizzui';
import { useCart } from '@/store/quick-cart/cart.context';
import { CiShoppingCart } from "react-icons/ci";


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
    const remainingAmount = Math.max(freeShippingThreshold - totalPrice, 0);

    return (
        <div className="max-w-[550px] mx-auto text-center text-sm sm:text-base leading-snug font-normal my-2 sm:my-4">
            {remainingAmount > 0 ? (
                <>
                    {t('spend')} {" "}
                    <span className="text-red-500 font-bold">
                        {remainingAmount.toLocaleString()} <span>{t('currency')}</span>
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

    const loadProductDetails = () => {
        const data = JSON.parse(localStorage.getItem('productDetails') || '[]');
        setProductDetailsArray(data);
    };

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

    const closeModal = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === 'modal-overlay') {
            setModal(false);
        }
    };
    const { items } = useCart();
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const freeShippingThreshold = 2000;

    return (
        <>
            {/* {productDetailsArray.length > 0 && ( */}
            <div className="relative">
            <div
                onClick={() => setModal(true)}
                className="bg-mainColor CartShadow w-[72px] h-16 rounded-lg fixed top-[50%] right-2 z-[999] flex flex-col gap-4 items-center justify-center p-2 cursor-pointer"
                >
                <div className="">
                    <CiShoppingCart  className="text-white text-2xl text-center mx-auto" />
                    <div className="flex gap-1 items-center ">

                    <p  className="text-white text-xs">
                        {items.length}
                    </p>
                    <p  className="text-white text-xs">
                         {items.length <=1 ? t('item') : t('items')}
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
                    <div className="h-full w-[320px] sm:w-[400px] bg-white relative ps-5 py-4 flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{t('cart')}</h2>
                            <button
                                onClick={() => setModal(false)}
                                className="text-textColor text-2xl px-3 py-2 rounded-lg"
                            >
                                <FontAwesomeIcon icon={faX as any} className='text-xl' />

                            </button>
                        </div>
                        <div className="w-full h-[1px] bg-black"></div>

                        <div className="flex-1 overflow-y-auto pt-3 pe-2">
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
                                    <ProgressBar totalPrice={totalPrice} freeShippingThreshold={freeShippingThreshold} />
                                    <FreeShippingMessage totalPrice={totalPrice} lang={lang!} freeShippingThreshold={freeShippingThreshold} />
                                </>
                            )}
                            <Link
                                href={`/${lang}/cart`}
                                className="bg-mainColor  text-white rounded-lg text-center text-lg sm:text-xl font-medium w-11/12 mx-auto block py-3 sm:py-4"
                            >
                                {t('order-cart')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartModal;