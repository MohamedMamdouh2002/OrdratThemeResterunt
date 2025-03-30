'use client'
import { useTranslation } from '@/app/i18n/client';
import React, { useEffect, useState } from 'react'
import Player from 'lottie-react';
import success from '@public/assets/xW5TndvMN2.json';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Text, Badge, Loader } from 'rizzui';

function SeccessPage({lang}:{lang?:string}) {
 
  const router = useRouter(); 
  const [isLoading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>(null);
  
  useEffect(() => {
    const id = localStorage.getItem('orderNumber');
    const orderVal = localStorage.getItem('orderId');
    setOrderId(id);
    setOrder(orderVal);
  
    if (!id || !orderVal) {
      router.push(`/${lang}`);
    }
  }, [router, lang]);
  
    const { t,i18n } = useTranslation(lang!, "home");
    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang, i18n]);
    const handleRemoveOrder = async () => {
      
      try {
        setLoading(true); 
        localStorage.removeItem('orderNumber');
        console.log('Order removed successfully');
        
        router.push(`/${lang}/orders/${order}`);
        setLoading(false); 
  
      } catch (error) {
        console.error('Error removing order:', error);
  
      } finally {
        setLoading(false);
      }
    };
return <>
    <div className="2xl:w-[80%]   w-11/12 mx-auto lg:my-10 my-24">
      <div className="text-center bg-white secShadow border rounded-2xl  sm:w-[500px] mx-auto p-5 ">
        <div className="flex justify-center">
          <Player
            autoplay
            loop={false}
            animationData={success}
            className='w-52'
          />
        </div>
        <h1 className='text-xl'>{t('order-sec')}</h1>
        <div className="mt-5 mb-10 space-y-4">
          <h2 className='font-medium text-lg'>{t('order-id')}</h2>
          <p className='font-medium text-lg '>{orderId}</p>
          <div className="">
          <button
            className="px-4 py-2 mt-3 bg-mainColor rounded-lg text-white text-lg font-medium"
            onClick={handleRemoveOrder}
          >
            {isLoading ?
              <Loader variant="spinner" size="lg" />
             
              :
              t('order-btn')
            }
          </button>
          </div>
        </div>
      </div>
    </div>
</>
}

export default SeccessPage