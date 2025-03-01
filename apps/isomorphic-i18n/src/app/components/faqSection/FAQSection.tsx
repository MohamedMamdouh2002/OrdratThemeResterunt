'use client';
import Image from 'next/image'
import style from'./FAQSection.module.css'
import registration from '../../../../public/assets/faq/faq/Registration.png';
import general from '../../../../public/assets/faq/faq/general.png';
import deposit from '../../../../public/assets/faq/faq/Security-deposit.png';
import property from '../../../../public/assets/faq/faq/Property.png';
import vehicles from '../../../../public/assets/faq/faq/Vehicles.png';
import number from '../../../../public/assets/faq/faq/number.png';
import etisalat from '../../../../public/assets/faq/faq/etisalat.png';
import tag from '../../../../public/assets/faq/faq/Tag.png';
import directSale from '../../../../public/assets/faq/faq/Direct-sale.png';
import arrow from '../../../../public/assets/faq/arrow.svg';
import arrowHover from '../../../../public/assets/faq/arrow-hover.svg';
import Findmore from '../../../../public/assets/faq/faq/Findmore.svg';
import FindmoreArrow from '../../../../public/assets/faq/faq/FindmoreArrow.svg';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { fetchData } from '@/utils/fetch/fetch';
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
// import { shopId } from '@/config/shopId';
import { useTranslation } from '@/app/i18n/client';
import { Loader } from 'lucide-react';

function FAQSection({ lang }: { lang: string }) {
  // const faq = [
  //   {
  //     id:'1',
  //     imgSrc: registration,
  //     title: 'Authantication',
  //     faqCardBody: [
  //       {
  //         description: 'How do you sign in the website?'
  //       },
  //       {
  //         description: 'Is opening an account in website free of charge?'
  //       },
  //       {
  //         description: 'I did not receive login code. What should I do?'
  //       },
  //     ],
  //   },
  //   {
  //     id:'2',
  //     imgSrc: general,
  //     title: 'General Questions icon',
  //     faqCardBody: [
  //       {
  //         description: 'Where are the website offices located?'
  //       },
  //       {
  //         description: 'How is the book order?'
  //       },
  //       {
  //         description: 'Are there branches of orders outside the website?'
  //       },
  //     ],
  //   },
  //   {
  //     id:'3',
  //     imgSrc: deposit,
  //     title: 'Security deposit',
  //     faqCardBody: [
  //       {
  //         description: 'What is a security deposit?'
  //       },
  //       {
  //         description: 'How much is the security deposit?'
  //       },
  //       {
  //         description: 'What should I do after paying the Security Deposit to be able to take offers?'
  //       },
  //     ],
  //   },
  //   {
  //     id:'4',
  //     imgSrc: vehicles,
  //     title: 'Delivery',
  //     faqCardBody: [
  //       {
  //         description: 'How much is the price that the delivery take?'
  //       },
  //       {
  //         description: 'How can I contact with delivery?'
  //       },
  //     ],
  //   },
  //   {
  //     id:'5',
  //     imgSrc: etisalat,
  //     title: 'Premium Packages',
  //     faqCardBody: [
  //       {
  //         description: 'What is Etisalat Premium package?'
  //       },
  //       {
  //         description: 'What benefits will I enjoy by subscribing to Etisalat Premium package?'
  //       },
  //       {
  //         description: 'What types of Etisalat packages are offered by Emirates Auction?'
  //       },
  //     ],
  //   },
  //   {
  //     id:'6',
  //     imgSrc: tag,
  //     title: '#Tag',
  //     faqCardBody: [
  //       {
  //         description: 'What is Etisalat’s #Tag Service?'
  //       },
  //       {
  //         description: 'What are the charges on #Tag service?'
  //       },
  //       {
  //         description: 'How can I subscribe to the #Tag service?'
  //       },
  //     ],
  //   },
  //   {
  //     id:'7',
  //     imgSrc: directSale,
  //     title: 'Card History',
  //     faqCardBody: [
  //       {
  //         description: ' What is “Card history”?'
  //       },
  //       {
  //         description: 'What is the process to increase order in the card?'
  //       },
  //       {
  //         description: 'How I could write Notes?'
  //       },
  //     ],
  //   },
  // ]; 
  
  const [faqData, setFaqData] = useState<FaqType[]>([]);
  const { setFaqs,updatefaqs,setUpdateFaqs, shopId } = useUserContext(); 
  const { t } = useTranslation(lang!, 'nav');
  const [loading, setLoading] = useState(false); 

  // Define images for different categories
  const images = [
    general,
    registration,
    deposit,
    vehicles,
    etisalat,
    tag,
    directSale,
  ];
  
  async function getFAQs() {
    setLoading(true);
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
      setLoading(false);
    } else {
      setFaqData([]);
      setLoading(false);
    }
  }
  useEffect(() => {
    getFAQs();
    if (updatefaqs === true) {
			getFAQs();
			setUpdateFaqs(false);	
		}
  }, [lang, updatefaqs]);
  console.log("faqData: ",faqData);
  
  
  return <>
    <div className={style.faqContainer}>
      <div className={style.faqWrapper}>
        <h3 className={`${style.faqTitle} pb-3`} style={{ textAlign: 'center' }}>
          {t('frequently-asked-questions')} <span className='text-mainColor' style={{ fontWeight: 'bold' }}>FAQ</span>
        </h3>
        {loading ?
          <div className="flex justify-center w-full">
            <Loader className="animate-spin text-mainColor" />
          </div>
          :
          <div className={style.faqCardsContainer}>
            {faqData.map((item, index) => (
              item.faQs.length > 0 && (
                
                <div key={index} className={`${style.faqCardWrapperContainer} group`}>
                  <Link href={routes.faq.details(`${index}`)} onClick={() => setFaqs([item])}>
                    <div className={style.faqCardWrapper}>
                      <div className={style.faqCardHead} style={{ alignItems: 'center' }}>
                        <div className={style.iconWrapper} style={{ width: '50px', marginInlineEnd: '5px' }}>
                          <Image
                            src={item.imageUrl || images[index]}
                            width="50"
                            height="50"
                            alt={item.name}
                          />
                        </div>
                        <h4 className={style.faqCardTitle}>{item.name}</h4>
                      </div>
                      <div className={style.faqCardBody}>
                        {item.faQs.slice(0, 3).map((faq, faqIndex) => (
                          <p key={faqIndex} className={style.faqCardDescription}>{faq.question}</p>
                        ))}
                      </div>
                    </div>
                    {/* <Link href={routes.faq.details(`${index}`)} onClick={() => setFaqs([item])}> */}
                    <button className={style.faqCardBtn}>
                      <p className='text-[#828e99] group-hover:text-mainColor'>{t('view-all')}</p>
                      <Image className={style.arrow} src={arrow} alt="arrow icon" />
                      <Image className={`${style.arrowHover} fill-mainColor`} src={arrowHover} alt="hover arrow icon" />
                    </button>
                  </Link>
                </div>
              )
            ))}
            {/* Repeat other FAQ sections here similarly */}
            <div className={`${style.FindMore} bg-mainColor`}>
              <div className={style.FindMoreTopContainer}>
                <div className={style.FindMoreTop}>
                  <Image src={Findmore} alt="Find more icon" />
                  <h2>{t('find-more')}</h2>
                </div>
                <div className={style.FindMoreCenter}>
                  <p>{t('browse')}</p>
                </div>
              </div>
              <div className={style.FindMoreFooter}>
                <Link href="/">
                  <button className={style.findmoreArrowBtn}>
                    <p>{t('view-all-faq')}</p>
                    <Image
                      className={style.FindmoreArrow}
                      src={FindmoreArrow}
                      alt="arrow icon"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </>
}

export default FAQSection