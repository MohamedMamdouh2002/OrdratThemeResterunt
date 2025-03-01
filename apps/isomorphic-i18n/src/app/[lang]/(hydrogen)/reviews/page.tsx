import Reviews from '@/app/components/reviews/Reviews'
import React from 'react'
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Reviews'),
};

function Review({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <>
  <div className="w-[90%] mx-auto ">
    <Reviews lang={lang}/>   
  </div>
  </>
}

export default Review