import React from 'react'
import { locale } from 'dayjs';
import { t } from 'i18next';
import Link from 'next/link';
import CartTemplate from '@/app/shared/ecommerce/cart';
import FAQSection from '../faqSection/FAQSection';
function FAQBody( { lang,faqs }: { lang?: string; faqs:FaqType[] }) {
  return <>
  <div className='w-[90%] mx-auto mt-8'>
    <FAQSection lang={lang?lang:'en'} faqData={faqs as any}/>
  </div>
  </>
}

export default FAQBody