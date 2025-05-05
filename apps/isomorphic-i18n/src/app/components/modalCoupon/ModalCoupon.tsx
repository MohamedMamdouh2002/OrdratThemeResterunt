'use client';

import React, { useRef, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useTranslation } from '@/app/i18n/client';
import CustomToast from '../CustomToast';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../context/UserContext';

interface CouponModalProps {
  lang: string;
  onClose: () => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ lang, onClose }) => {
  const { t } = useTranslation(lang, 'home');
  const { shopId } = useUserContext();
  const currencyAbbreviation =localStorage.getItem('currencyAbbreviation')

  const [coupon, setCoupon] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      touchStartY.current !== null &&
      touchEndY.current !== null &&
      touchEndY.current - touchStartY.current > 80
    ) {
      setIsClosing(true);
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setShowToast(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isClosing, onClose]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Coupon/GetAll/${shopId}?PageNumber=1&PageSize=500`);
        const data = await response.json();
        console.log('كوبون', data);

        setCoupon(data.entities);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div
      id="overlay"
      className="fixed inset-0 z-[99999] bg-black bg-opacity-30 flex justify-start right-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'overlay') {
          setIsClosing(true);
        }
      }}
    >
      <div
        className={`absolute bottom-0 bg-white h-[400px] w-[320px] sm:w-[400px] shadow-xl transition-transform duration-300 ${isClosing ? 'translate-y-full' : isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <button
          onClick={() => setIsClosing(true)}
          className="absolute top-4 end-4 text-gray-600 hover:text-red-500"
        >
          <IoMdClose size={22} />
        </button>

        <div className="pt-4 pb-5">
          <h2 className="text-lg sm:text-xl font-semibold px-5 mb-4">
            {t('select_available_coupon')}
          </h2>

          {showToast && (
            <CustomToast message={t('coupon')} onClose={() => setShowToast(false)} />
          )}

          <div className="space-y-4 mt-3 max-h-[320px] ps-5 pe-5 overflow-y-auto pr-1 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {coupon
              ?.filter((c: any) =>
                c.isActive &&
                !c.isBanner &&
                c.usageNumbers < c.usageLimit &&
                new Date(c.expireDate) > new Date()
              )
              .map((c: any, i: number) => (
                <div
                  key={i}
                  onClick={() => handleCopyCoupon(c.code)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow transition cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                    <span>{t('expire')}</span>
                    <span>
                      {t('discount')} 
                      {c.discountType === 0 ? `${c.discountValue} %` :`   ${c.discountValue} ${currencyAbbreviation}`
                      }
                    </span>
                  </div>
                  <div className="text-center font-bold border border-dashed border-gray-400 py-2 px-4 rounded text-lg tracking-widest text-black">
                    {c.code}
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">{c.code}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
