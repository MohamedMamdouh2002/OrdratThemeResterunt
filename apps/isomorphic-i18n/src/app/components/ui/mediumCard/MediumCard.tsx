import { Food } from '@/types';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Modal from '../modal/Modal';
import Badge from '../Badge';
import { Star, Flame } from 'lucide-react';
import TextTruncate from '../../ui/TruncateText';
import { toCurrency } from '@utils/to-currency';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png'
import hamburger from '@public/assets/hamburger.png'
import potato from '@public/assets/شاورما-عراقي-لحمة-مع-بطاطا.png'
type Props = Food & {
  lang:string;
  setCurrentItem: Dispatch<
    SetStateAction<{
      type?: string;
      id: string;
    } | null>
  >;
};

function MediumCard(data:Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
        <div onClick={handleOpenModal} className="flex flex-wrap sm:border sm:border-dashed sm:border-mainColor pb-2 sm:pb-4 sm:p-4 rounded-lg justify-between mt-5 gap-5 hover:cursor-pointer">
          <div className="flex sm:flex-row w-full sm:gap-0 gap-3 h-[135px] 4xl:h-[200px] rounded-lg">
            <div className="relative w-full sm:w-8/12 4xl:w-9/12">
              <div className="sm:pe-2 4xl:pe-0">
                {data?.isTopRated || data.isTopSelling ? (
                  <span className="text-[8px] font-bold text-center rounded-lg ">
                    {data.isTopRated ? (
                      <Badge Icon={Star} title="Top Rated" className="-ms-1" />
                    ) : (
                      <Badge Icon={Flame} title="Top Sell" className="-ms-1" />
                    )}
                  </span>
                ) : (
                  ""
                )}
                <h2 className="text-lg font-medium">{data.name}</h2>
              </div>
              <TextTruncate text={data.description} limit={10} />
              <div className="mt-2 flex items-center font-semibold text-mainColor absolute bottom-2">
                <span>
                  {toCurrency(data.price, data.lang)}
                </span>
                {data.oldPrice && (
                  <del className="ps-1.5 text-[13px] font-normal text-gray-500">
                    {toCurrency(data.oldPrice, data.lang)}
                  </del>
                )}
              </div>
            </div>
            <div className="relative w-[160px] h-[130px] sm:w-4/12 4xl:w-3/12  sm:h-full rounded-lg sm:rounded-s-lg">

            <Image
              src={data?.imageUrl||photo}
                layout="fill"
                objectFit="cover"
              className="rounded-lg sm:rounded-s-lg"
              alt=""
              />
            </div>
          </div>
        </div>
  
  {isModalOpen && (
    <Modal
      lang={data.lang}
      modalId={data.id}
      setIsModalOpen={handleCloseModal}
      quantity={quantity}
      setQuantity={setQuantity}
      // setShowItem={function (val: boolean): void {
      //   throw new Error('Function not implemented.');
      // } }
    />
  )}

{/* <hr className='mt-3 sm:hidden flex'/> */}

            
  </>
  )
}

export default MediumCard;
