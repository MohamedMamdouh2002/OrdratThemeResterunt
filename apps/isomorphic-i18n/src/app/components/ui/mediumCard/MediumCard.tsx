import { Food } from '@/types';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Modal from '../modal/Modal';
import Badge from '../Badge';
import { Star, Flame } from 'lucide-react';
import TextTruncate from '../../ui/TruncateText';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png'
import hamburger from '@public/assets/hamburger.png'
import potato from '@public/assets/شاورما-عراقي-لحمة-مع-بطاطا.png'
import { AnimatePresence } from 'framer-motion';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
type Props = Food & {
  lang: string;
  ProductData?: any
  FakeData?: any
  currencyName?:any
  setCurrentItem: Dispatch<
    SetStateAction<{
      type?: string;
      id: string;
    } | null>
  >;
};

 function MediumCard(data: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // const abbreviation = useCurrencyAbbreviation({ lang: data.lang });
  const [currentModalProductId, setCurrentModalProductId] = useState<string | null>(null);
  // const headerData = await ServerHeaderData(data.lang);

  const handleOpenModal = (id: string) => {
    // تعيين معرف المنتج الأولي
    setCurrentModalProductId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={() => handleOpenModal(data.id)} className="flex flex-wrap sm:border sm:border-dashed sm:border-mainColor pb-2 sm:pb-4 sm:p-4 rounded-lg justify-between mt-5 gap-5 hover:cursor-pointer">
        <div className="flex sm:flex-row w-full sm:gap-0 gap-3 h-[135px] 4xl:h-[200px] rounded-lg">
          <div className="relative w-full sm:w-8/12 4xl:w-9/12">
            <div className="sm:pe-2 4xl:pe-0">
              {data?.isTopRated || data.isTopSelling ? (
                <span className="text-[8px] font-bold text-center rounded-lg ">
                  {data?.isTopRated ?
                    <Badge Icon={Star} title={data.lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="" />
                    :
                    <Badge Icon={Flame} title={data.lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="" />
                  }
                </span>
              ) : (
                ""
              )}
              <h2 className="text-lg font-medium">{data.lang === 'ar' ? data.nameAr : data.nameEn}</h2>
            </div>
            <TextTruncate text={data.lang === 'ar' ? data.descriptionAr : data.descriptionEn} limit={10} />
            <div className="mt-2 flex items-center font-semibold text-mainColor absolute bottom-2">
              <span className='flex items-center gap-1'>
              {data.finalPrice}{" "}{data.currencyName}
                {/* {abbreviation && toCurrency(data.finalPrice, data.lang, abbreviation)} */}
              </span>
              {data.isDiscountActive ===true  && (
                <del className="ps-1.5 text-[13px] font-normal text-gray-500 flex items-center gap-1">
                {data.price}{" "}{data.currencyName}
                 
                  {/* {abbreviation && toCurrency(data.price, data.lang, abbreviation)} */}
                </del>
              )}
            </div>
          </div>
          <div className="relative w-[160px] h-[130px] sm:w-4/12 4xl:w-3/12  sm:h-full rounded-lg sm:rounded-s-lg">
            <Image
              src={data?.images ? data?.images[0]?.imageUrl || photo : photo}
              layout="fill"
              objectFit="cover"
              className="rounded-lg sm:rounded-s-lg"
              alt={data.nameAr}
            />
          </div>
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {isModalOpen && (
          <Modal
            setCurrentModalProductId={setCurrentModalProductId}
            lang={data.lang}
            ProductData={data.ProductData}
            FakeData={data.FakeData}
            currencyAbbreviation={data.currencyName ==='ر.س'? <Image src={sarIcon} alt="SAR" width={30} height={30} /> :data.currencyName}
            modalId={data.id}
            // نمرر أيضًا currentModalProductId للسماح للمودال بتحديث البيانات داخليًا
            currentModalProductId={currentModalProductId}
            setIsModalOpen={setIsModalOpen}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        )}
      </AnimatePresence>
      {/* <hr className='mt-3 sm:hidden flex'/> */}


    </>
  )
}

export default MediumCard;
