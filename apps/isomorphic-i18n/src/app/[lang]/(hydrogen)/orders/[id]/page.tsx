import OrderView from '@/app/shared/ecommerce/order/order-view'
import React from 'react'
import SessionGuard from '@/app/components/ui/hoc/layout/SessionGuard';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'طلباتي | تتبع طلباتك بسهولة' : 'My Orders | Track Your Orders Easily',
      lang,
      undefined,
      lang === 'ar' ? 'تابع حالة طلباتك الحالية، تحقق من تفاصيل الطلب، وتتبع حالة التوصيل في أي وقت.' : 'Track your current orders, check order details, and monitor delivery status anytime.',
    ),
  };
}
function OrderId({
  params: { lang },
}: {
  params: {
    lang: string;
  };
})  {
  return <>
  <SessionGuard>
    <div className="w-5/6 mx-auto">
      <OrderView lang={lang}/>
    </div>
  </SessionGuard>
  </>
}

export default OrderId