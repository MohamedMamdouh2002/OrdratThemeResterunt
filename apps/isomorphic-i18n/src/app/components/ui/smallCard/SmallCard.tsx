import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import { Title, Text } from 'rizzui';
import { Food } from '@/types';
import { Flame, Plus, Star } from 'lucide-react';
import Badge from '../Badge';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png'
import Modal from '../modal/Modal';
import CustomImage from '../CustomImage';
import { AnimatePresence } from 'framer-motion';
import ServerHeaderData from '../../ServerHeader';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
type Props = Food & {
  lang: string;
  ProductData?: any
  FakeData?: any
currencyName:any
  setCurrentItem: Dispatch<
    SetStateAction<{
      type?: string;
      id: string;
    } | null>
  >;
};

function SmallCard(data: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // const abbreviation = useCurrencyAbbreviation({ lang: data.lang });
  const [currentModalProductId, setCurrentModalProductId] = useState<string | null>(null);
  // const headerData = await ServerHeaderData(data.lang);

  // Optimized modal opener - opens immediately
  const handleOpenModal = (id: string) => {
    setCurrentModalProductId(id);
    // No delay - open immediately
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={() => handleOpenModal(data.id)}
        className="w-[115px] hover:cursor-pointer sm:w-[120px] md:w-[150px] lg:w-[200px] overflow-x-auto">
        {/* Product card content remains the same */}
        <div className="relative">
          <CustomImage
            src={data?.images ? data?.images[0]?.imageUrl || photo : photo}
            width={200}
            height={180}
            objectFit="cover"
            className="md:w-[200px] bg-[#E8E8E8] h-[115px] md:h-40 rounded-2xl object-cover"
              alt={data.nameAr}
          />
          {data?.isTopRated || data?.isTopSelling ? (
            <span className="absolute start-1.5 top-1.5 text-[8px] font-bold text-center min-w-10 rounded-md">
              {data?.isTopRated ?
                <Badge Icon={Star} title={data.lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="" />
                :
                <Badge Icon={Flame} title={data.lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="" />
              }
            </span>
          ) : (
            ""
          )}
          <div className="absolute bottom-1.5 end-1.5 w-9 h-9 bg-white rounded-lg flex justify-center items-center text-3xl text-mainColor">
            <Plus />
          </div>
        </div>
        <div>
          <Title
            as="h6"
            className="mt-1 text-sm truncate font-semibold transition-colors group-hover:text-mainColor"
          >
            {data.lang === 'ar' ? data.nameAr : data.nameEn}

          </Title>
          <Text as="p" className="truncate text-sm pe-6">
            {data.lang === 'ar' ? data.descriptionAr : data.descriptionEn}
          </Text>
          <div className="mt-2 flex flex-col items-start font-semibold text-mainColor">
            <div className='text-[12px] sm:pt-0 pt-0.5 font-normal sm:text-[13px]'>
              <span className='flex items-center gap-1'>
                {/* {abbreviation && toCurrency(data.finalPrice, data.lang, abbreviation)} */}
                {data.finalPrice}{" "}{data.currencyName}

              </span>
            </div>
            {data.isDiscountActive ===true &&
              <div>
              <del className="text-[12px] sm:text-[13px] font-normal text-gray-500 flex items-center gap-1">
                  {/* {abbreviation && toCurrency(
                    data.lang, abbreviation)} */}
                {data.price}{" "}{data?.currencyName as any}
              </del>
            </div>
            }
          </div>
        </div>
      </div>

      {/* Wrap in AnimatePresence for proper animation handling */}
      <AnimatePresence mode='wait'>
        {isModalOpen && (
          <Modal
            setCurrentModalProductId={setCurrentModalProductId}
            lang={data.lang}
            ProductData={data.ProductData}
            modalId={data.id}
            currencyAbbreviation={data.currencyName ==='ر.س'? <Image src={sarIcon} alt="SAR" width={30} height={30} /> :data.currencyName}
            FakeData={data.FakeData}
            currentModalProductId={currentModalProductId}
            setIsModalOpen={setIsModalOpen}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default SmallCard;