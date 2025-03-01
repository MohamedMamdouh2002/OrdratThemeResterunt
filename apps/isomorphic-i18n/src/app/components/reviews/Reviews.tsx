'use client'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../context/UserContext';
import Title from '../ui/title/Title';
import Image from 'next/image';
import { Icon, Loader, Star } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

function Reviews({ lang }: { lang: string }) {
    const { GetRewiew } = useUserContext();
    const [reviews, setReviews] = useState<any[]>([])
    const { t } = useTranslation(lang!, 'nav');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
	    setLoading(true)
        const fetchData = async () => {
        const data = await GetRewiew({lang});
		setLoading(false)
        const review =data.entities
        setReviews(review)
        console.log('review Data:', review);
        
      };
  
      fetchData();
    }, [GetRewiew]);
  return <>
    <Title className="text-center mt-20 text-[#404040]" title={t('review')}/>
    {loading? 
        <div className="flex justify-center ">
        <Loader className="animate-spin text-mainColor " /> 
      </div>
      :
      <>
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center gap-6 mb-5 ">
        {reviews.map((review)=><>
            <div className="border border-dashed group border-mainColor p-3 rounded-lg transition-all duration-700 hover:cursor-pointer hover:border-solid">
                <div className="flex items-center gap-3">
                    <Image src={`https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-01.webp`}
                        className='rounded-full'
                        width={40}
                        height={40} alt='user' />
                    <div className="">
                        <h3 className='text-base group-hover:text-mainColor font-medium'>
                            
                            {review.endUser.name ? 
                            <>
                                {review.endUser.name}
                            </>
                            :
                            <>
                                {t('dear-client')}
                            </>
                            }
                        </h3>
                        {Array.from({ length: review.rate }, (_, index) => (
                            <Star key={index} className="fill-mainColor inline text-mainColor" size={12} />
                        ))}
                    </div>
                </div>
                {/* <div className="flex items-center space-x-1"> */}
                    {/* هنا يتم تكرار النجوم بناءً على قيمة rate */}
                {/* </div> */}
                <div className="mt-1 space-y-5">
                    <p>{review.reviewText}</p>
                    <span>{review.createdAt}</span>
                </div>
            </div>

        </>
        )}
        </div>
      </>
    }
  </>
}

export default Reviews