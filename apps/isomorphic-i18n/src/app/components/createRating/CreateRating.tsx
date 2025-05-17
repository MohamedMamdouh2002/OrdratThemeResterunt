'use client';

import { useTranslation } from '@/app/i18n/client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import angry from '@public/emoji/angry.png';
import sad from '@public/emoji/sad.png';
import confused from '@public/emoji/confused.png';
import happy from '@public/emoji/happy.png';
import love from '@public/emoji/love.png';
import Image from 'next/image';
import { Textarea } from 'rizzui';
import { Loader, MessageSquareDashed } from "lucide-react";
import axiosClient from '../fetch/api';
import { useUserContext } from '../context/UserContext';
import toast from 'react-hot-toast';
import {  useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

function CreateRating({ lang,id }: { lang?: string;id:string }) {
  const { t } = useTranslation(lang!, 'home');
  const [selected, setSelected] = useState(2);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { shopId } = useUserContext();
  const router = useRouter();

  const [isCheckingOrder, setIsCheckingOrder] = useState(true); 
  useEffect(() => {
console.log('orderId',id);

 
      setIsCheckingOrder(false); 
 }, [lang, router]);

  const handleSubmit = async () => {

    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);

      await axiosClient.post(
        `https://testapi.ordrat.com/api/Review/CreateReview/${shopId}/${id}`,
        {
          reviewText: message,
          rate: selected + 1,
          shopId,
          orderId:id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      toast.success('تم إرسال التقييم بنجاح');
      localStorage.removeItem('orderId');
      router.replace(`/${lang}/reviews`);

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'حدث خطأ أثناء إرسال التقييم';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🛑 ما نعرضش أي حاجة لحد ما نتحقق من orderId
  if (isCheckingOrder) return null;

  return (
    <div className="bg-[#fff] secShadow1 w-[350px] md:w-[480px] md:h-[500px] h-auto rounded-lg mx-auto lg:my-5 my-24 p-4">
      <div className="my-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-md">
          <MessageSquareDashed className="w-4 h-4" />
        </div>
        <p className='text-lg font-semibold text-black'>{t('feedback')}</p>
      </div>
      <div className="bg-black w-full h-[0.5px]" />
      <div className="text-center space-y-3 mt-4">
        <h2 className='text-2xl'>{t('feel')}</h2>
        <p>{t('feeldesc')}</p>
      </div>

      <div className="relative flex items-center justify-center h-auto ">
        <div className="relative flex flex-wrap justify-center gap-4 md:gap-6 z-10 my-3">
          {[
            { icon: angry, label: t('VeryBad') },
            { icon: sad, label: t('Bad') },
            { icon: confused, label: t('Medium') },
            { icon: happy, label: t('Good') },
            { icon: love, label: t('Excellent') },
          ].map((emoji, index) => {
            const isSelected = selected === index;
            return (
              <motion.div
                key={index}
                className="relative flex flex-col items-center justify-center cursor-auto"
                whileHover={isSelected ? {} : { scale: 1.2 }}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected ? "bg-gradient-to-br from-[#DEE877] to-[#6EDBA0] z-0 scale-105 shadow-lg" : ""
                  }`}
                >
                  <motion.span
                    onClick={() => setSelected(index)}
                    animate={{ scale: isSelected ? 1.8 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="z-10 cursor-pointer"
                  >
                    <Image width={25} height={25} src={emoji.icon} alt={emoji.label} />
                  </motion.span>
                </div>
                {isSelected && (
                  <div className="mt-2 px-3 py-1 bg-neutral-900 text-white text-sm rounded-full shadow-md">
                    {emoji.label}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Textarea
        placeholder={t('comment')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className='bg-gradient-to-br from-[#319E8B] to-[#4DB55C] text-white w-full py-3 rounded-lg mt-5 text-lg font-medium'
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin text-mainColor" />
          </div>
        ) : (
          t('Subbmit')
        )}
      </button>
    </div>
  );
}

export default CreateRating;
