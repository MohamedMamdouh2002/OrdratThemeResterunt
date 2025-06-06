import Image from 'next/image';
import { Title, Text } from 'rizzui';
import cn from '../../../../../../../packages/isomorphic-core/src/utils/class-names';
import { Dispatch, SetStateAction, useState } from 'react';
import Modal from '../modal/Modal';
import { Food, Product } from '@/types';
import Badge from '../Badge';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png'
import hamburger from '@public/assets/hamburger.png'
import potato from '@public/assets/شاورما-عراقي-لحمة-مع-بطاطا.png'
import { Star, Flame } from 'lucide-react';
import CustomImage from '../CustomImage';
import { AnimatePresence } from 'framer-motion';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

type Props = Food & {
  lang: string;
  ProductData?: any
  FakeData?: any
  currencyName?: any
  setCurrentItem: Dispatch<
    SetStateAction<{
      type?: string;
      id: string;
    } | null>
  >;
};

function Card(data: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // const abbreviation = useCurrencyAbbreviation({ lang: data.lang });
  const [currentModalProductId, setCurrentModalProductId] = useState<string | null>(null);
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
      <div onClick={() => handleOpenModal(data.id)} className="hover:scale-105 hover:cursor-pointer w-full duration-200">
        <div className="relative w-full h-[100px] mb-2 xs:h-[200px] md:h-[200px] lg:h-[220px] xl:h-[270px] 2xl:h-[300px]">
          <CustomImage
            alt="card food1"
            src={data?.images && data?.images[0]?.imageUrl}
            layout="fill"
            objectFit="cover"
            quality={90}
            className="rounded-lg"
          />
        </div>
        {data?.isTopRated || data.isTopSelling ? (
          <span className="text-[8px] font-bold text-center min-w-10 rounded-lg bg-[#FECACA] text-[#EF4444]">
            {data?.isTopRated ?
              <Badge Icon={Star} title={data.lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="" />
              :
              <Badge Icon={Flame} title={data.lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="" />
            }
          </span>
        ) : (
          ""
        )}
        <Title as="h6" className="my-1 truncate font-semibold transition-colors group-hover:text-mainColor">
          {data.lang === 'ar' ? data.nameAr : data.nameEn}
        </Title>
        <Text as="p" className="truncate">
          {data.lang === 'ar' ? data.descriptionAr : data.descriptionEn}
        </Text>
        <div className="mt-2 flex items-center font-semibold text-mainColor  gap-1">
          {/* {abbreviation && toCurrency(data.finalPrice, data.lang, abbreviation)} */}
          {data.finalPrice}{" "}{data.currencyName}

          {data.isDiscountActive === true && (
            <del className="ps-1.5 text-[13px] font-normal text-gray-500 flex items-center gap-1">
              {/* {abbreviation && toCurrency(data.price, data.lang, abbreviation)} */}
              {data.price}{" "}{data.currencyName}
            </del>
          )}
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {isModalOpen && (
          <Modal
            setCurrentModalProductId={setCurrentModalProductId}
            lang={data.lang}
            ProductData={data.ProductData}
            modalId={data.id}
            currencyAbbreviation={data.currencyName === 'ر.س' ? <Image src={sarIcon} alt="SAR" width={30} height={30} /> : data.currencyName}
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
};

export default Card;