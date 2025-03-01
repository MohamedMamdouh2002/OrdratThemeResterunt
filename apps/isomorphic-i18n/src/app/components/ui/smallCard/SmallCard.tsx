import React, { Dispatch, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { Title, Text } from 'rizzui';
import { Food } from '@/types';
import {  Flame, Plus, Star } from 'lucide-react';
import Badge from '../Badge';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png'
import hamburger from '@public/assets/hamburger.png'
import potato from '@public/assets/شاورما-عراقي-لحمة-مع-بطاطا.png'
import Modal from '../modal/Modal';
import { toCurrency } from '@utils/to-currency';
type Props = Food & {
    lang:string;
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


    const handleOpenModal = () => {
      console.log("Opening Modal...");
      setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
      console.log("Closing Modal...");
      setIsModalOpen(false);
    };
    
  return<>
    <>
        <div
        onClick={handleOpenModal} 
        className="w-[115px] hover:cursor-pointer  sm:w-[120px] md:w-[150px] lg:w-[200px]  overflow-x-auto">
            <div className="relative">
                <Image 
                src={data?.imageUrl||photo} 
                // src={data?.imageUrl} 
                width={200} 
                height={180} 
                className="md:w-[200px] p-2 sm:p-10 bg-[#E8E8E8]  h-[115px] md:h-40 rounded-2xl" 
                alt="" 
                />
                {data?.isTopRated || data?.isTopSelling ? (
                <span className="absolute start-1.5 top-1.5 text-[8px] font-bold text-center min-w-10   rounded-md   ">
                    {data?.isTopRated ? 
                    <>
                        <Badge Icon={Star} title="Top Rated" className="" />
                    </>
                    :
                    <>
                        <Badge Icon={Flame} title="Top Sell" className="" />
                    </>
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
                {data?.name}
                </Title>
                <Text as="p" className="truncate text-sm pe-6">
                {data?.description}
                </Text>
                <div className="mt-2 flex flex-col  items-start font-semibold text-mainColor">
                <div className='text-[12px] sm:pt-0 pt-0.5 font-normal sm:text-[13px]'>
                    <span>
                      {toCurrency(data.price, data.lang)}
                    </span>
                </div>
                <div>
                    <del className="  text-[12px] sm:text-[13px] font-normal text-gray-500">
                      {toCurrency(data.oldPrice, data.lang)}
                    </del>
                </div>
                </div>
            </div>
        </div>
    </>
   
    {isModalOpen && (
        <Modal
            lang={data.lang}
            modalId={data.id}
            setIsModalOpen={setIsModalOpen} // تأكد من تمرير الحالة

            // setIsModalOpen={handleCloseModal}
            quantity={quantity}
            setQuantity={setQuantity}
            // setShowItem={function (val: boolean): void {
            // throw new Error('Function not implemented.');
            // } }
        />
    )}

  </>
}

export default SmallCard