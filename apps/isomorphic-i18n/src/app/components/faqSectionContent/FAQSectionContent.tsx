'use client';
import Image from 'next/image'
import style from'../faqSection/FAQSection.module.css'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "@/app/i18n/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../context/UserContext';
import { fetchData } from '@/utils/fetch/fetch';
// import { shopId } from '@/config/shopId';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

function FAQSectionContent({ lang }: { lang: string }) {
  const { t } = useTranslation(lang!, "nav");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  // const { faqs } = useUserContext(); 
  const [faqData, setFaqData] = useState<FaqType[]>([]);
  const { setFaqs,updatefaqs,setUpdateFaqs, shopId } = useUserContext(); 
  
  console.log("faqscontext: ",faqData);
  const toggleAccordion = (id: string) => {
      setOpenAccordion((prev) => (prev === id ? null : id));
  };

  async function getFAQs() {
    const { data, message } = await fetchData<FaqType[]>({
      link: `api/FAQCategory/GetShopFAQs/${shopId}`,
      lang: lang
    });
    console.log('faq data: ', data);
    console.log('massage: ',message);
    console.log("lang: ",lang);
    
    if (data) {
      setFaqData(data);
      console.log("data: ",data);
      
    } else {
      setFaqData([]);
    }
  }
  useEffect(() => {
    getFAQs();
    if (updatefaqs === true) {
			getFAQs();
			setUpdateFaqs(false);	
		}
  }, [lang, updatefaqs]);

  const params = useParams();
  const categoryIndex = params?.id ? parseInt(params.id as string, 10) : null;

  if (categoryIndex === null || isNaN(categoryIndex) || !faqData[categoryIndex]) {
    return <div className="flex justify-center w-full my-24 lg:mt-10">
      <Loader className="animate-spin text-mainColor" width={40} height={40} />
    </div>;
  }

  const selectedFaqCategory = faqData[categoryIndex];
  return (
    <section className="bg-white dark:bg-mainBg text-[#020710] font-montserrat">
      <div className={style.faqContainer}>
        <h3 className={style.faqTitle} style={{ textAlign: 'center' }}>
          {t('frequently-asked-questions')} <span className='text-mainColor' style={{ fontWeight: 'bold' }}>FAQ</span>
        </h3>
        <h3 className={style.faqTitle} style={{ textAlign: 'center' }}>
          {selectedFaqCategory?.name}
        </h3>
        <div className="md:w-10/12 w-11/12 mb-10 gap-20 mx-auto">  
          <div className="col-span-6 pt-5">
            {selectedFaqCategory?.faQs?.map((faq, index) => (
              <div key={`${index}`} className="mb-8 relative rounded-xl shadow-lg border border-mainColor border-s-0">
                  <button
                      aria-expanded={openAccordion === `${index}`}
                      style={{ borderColor: index % 2 === 0 ? 'var(--main-color)' : '#5B5B5B' }}
                      onClick={() => toggleAccordion(`${index}`)}
                      className={`relative 4xl:h-32 bg-white dark:bg-secDark dark:text-white font-monbold flex justify-between items-center w-full ps-0 p-4 border h-auto md:h-min-[90px]
                          ${openAccordion === `${index}` ? 'rounded-b-none rounded-xl border-b-0 border-s-8 border-t-0 border-e-0' : 'border-b-0 border-s-8 border-t-0 border-e-0 rounded-xl'}`}
                  >
                      <span className="md:text-base 4xl:text-xl text-start text-base font-montserrat ps-5 dark:text-white">{faq.question}</span>
                      <FontAwesomeIcon className="4xl:text-2xl ps-2" icon={openAccordion === `${index}` ? faAngleUp : faAngleDown  as any} />
                  </button>
                  <div
                      style={{ borderColor: index % 2 === 0 ? 'var(--main-color)' : '#5B5B5B' }} 
                      className={`top-0 end-0 grid overflow-hidden 4xl:text-2xl transition-all text-md text-[#747794] dark:bg-secDark
                          ${openAccordion === `${index}` ? 'rounded-t-0 ps-5 px-10 bg-white grid-rows-[1fr] opacity-100 rounded-b-xl pb-5 border-s-8 border-t-0 border-b-0 border-e-0' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                      <p className="overflow-hidden">{faq.answer}</p>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

}

export default FAQSectionContent