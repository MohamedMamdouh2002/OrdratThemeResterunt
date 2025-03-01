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
    }; const { items } = useCart();


    return (
        <>
            {/* {productDetailsArray.length > 0 && ( */}
            <div className="relative">
            <div
                onClick={() => setModal(true)}
                className="bg-mainColor w-16 h-16 rounded-lg fixed top-[50%] right-0 z-[999] flex flex-col gap-4 items-center justify-center p-2 cursor-pointer"
                >
                <div className="flex gap-2 text-white relative">
                    <FontAwesomeIcon icon={faCartShopping as any} className="text-white text-lg" />
                    <span className='absolute -left-2 -top-4 bg-white px-1 py-.5 rounded-full text-mainColor'>

                    {items.length}
                    </span>
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
                                        image={<EmptyProductBoxIcon  className='w-5/12 mx-auto'/>}
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

                        <div className="sticky bottom-0 left-0 right-0 bg-white pt-3 ">
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
