import Reviews from '@/app/components/reviews/Reviews';
import React from 'react';
import { metaObject } from '@/config/site.config';

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


function Review({ params: { lang } }: { params: { lang: string } }) {
  return (
    <div className="w-[90%] mx-auto">
      <Reviews lang={lang} />
    </div>
  );
}

export default Review;
