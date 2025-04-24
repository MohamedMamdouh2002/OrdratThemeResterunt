import { API_BASE_URL } from '@/config/base-url';
import Reviews from '@/app/components/reviews/Reviews';
import React from 'react';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { Review as type} from '@/types';
import { cookies } from 'next/headers';
import { getReviewsFromServer } from '@/server/reviews';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'مراجعات العملاء | آراء حقيقية عن خدماتنا' : 'Customer Reviews | Real Opinions About Our Services',
      lang,
      undefined,
      lang === 'ar' ? 'اقرأ تقييمات العملاء عن خدماتنا ومنتجاتنا. شارك تجربتك وساعد الآخرين في اختيار الأفضل.' : 'Read real customer reviews about our services and products. Share your experience and help others choose the best.',
    ),
  };
}


async function Review({ params: { lang } }: { params: { lang: string } }) {
  const cookieStore = cookies();
  const shopId = cookieStore.get('shopId')?.value;
  const reviews = await getReviewsFromServer(lang, shopId as string);

  return (
    <div className="w-[90%] mx-auto">
      {/* <Reviews lang={lang} reviews={reviews as any} /> */}
    </div>
  );
}

export default Review;
